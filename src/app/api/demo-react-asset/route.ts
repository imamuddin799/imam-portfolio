// FILE: src/app/api/demo-react-asset/route.ts
// PURPOSE: Serves ANY static asset from a built React project's public/builds/<slug>/ folder.
//          Handles JS bundles, CSS, images, fonts — everything Vite puts in the build output.
//          The file param is a path relative to the build folder e.g. "assets/index-XYZ.js"
// USED BY: demo-react/route.ts rewrites all asset URLs to point here.
//          The runtime shim in demo-react also redirects dynamic asset loads here.

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BUILDS_ROOT = path.join(process.cwd(), "public", "builds");

const MIME: Record<string, string> = {
    js: "application/javascript",
    mjs: "application/javascript",
    css: "text/css",
    html: "text/html",
    json: "application/json",
    map: "application/json",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",
    mp4: "video/mp4",
    webm: "video/webm",
    txt: "text/plain",
};

export async function GET(req: NextRequest) {
    // console.log('demo-react-asset execution start');
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get("slug");
    const filePath = searchParams.get("file");

    // console.log('search param', searchParams);
    // console.log('slug param', slugParam);
    // console.log('file param', filePath);

    // console.log('Cheking Slug and FilePath availability');
    if (!slugParam || !filePath) {
        return new NextResponse("Missing slug or file param", { status: 400 });
    }
    // console.log('Checking Slug and FilePath availability>>>Pass');

    // console.log("Search Parameter>>>", searchParams);
    // console.log("Slug Parameter>>>", slugParam);
    // console.log("File Path>>>", filePath);

    const slug = decodeURIComponent(slugParam).split("/");
    const buildDir = path.join(BUILDS_ROOT, ...slug);
    const fullPath = path.join(buildDir, decodeURIComponent(filePath));

    // console.log('Decoded URI Component>>>', slug);
    // console.log('Build Directory>>>', buildDir);
    // console.log('Full Path>>>', fullPath);
    // Security: must stay within builds root

    // console.log('Checking BuildDir Start with', BUILDS_ROOT, 'and Full Path starts with', buildDir);
    if (!buildDir.startsWith(BUILDS_ROOT) || !fullPath.startsWith(buildDir)) {
        return new NextResponse("Forbidden", { status: 403 });
    }
    // console.log('Checking BuildDir and FullPath>>>pass');

    let resolvedPath = fullPath;

    // 🔁 Handle legacy src/assets paths
    // console.log('Before handle legacy resolved path>>>', resolvedPath);
    if (!fs.existsSync(resolvedPath) && filePath.startsWith("src/assets/")) {
        const fileName = path.basename(filePath);

        const assetsDir = path.join(buildDir, "assets");

        if (fs.existsSync(assetsDir)) {
            const match = fs.readdirSync(assetsDir).find(f =>
                f.startsWith(fileName.split(".")[0])
            );

            if (match) {
                resolvedPath = path.join(assetsDir, match);
            }
        }
    }
    // console.log('After handle legacy resolved path>>>', resolvedPath);

    // console.log('Checking file available or not');
    if (!fs.existsSync(resolvedPath)) {
        return new NextResponse("Asset not found: " + filePath, { status: 404 });
    }
    // console.log('Checking file available or not>>>pass');

    const ext = resolvedPath.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = MIME[ext] ?? "application/octet-stream";

    // ── Special handling for JS/CSS (rewrite sourceMappingURL) ──
    // console.log('Handling JS/CSS rewrite sourceMapping');
    if (ext === "js" || ext === "css") {
        let content = fs.readFileSync(resolvedPath, "utf-8");

        // console.log("Content Before Replacement", content);
        content = content.replace(
            /sourceMappingURL=(.+)$/gm,
            (match, mapFile) => {
                const encodedSlug = encodeURIComponent(slugParam);

                // 🔑 derive correct relative path
                const fileDir = path.posix.dirname(filePath); // NOT resolvedPath
                const mapPath = path.posix.join(fileDir, mapFile.trim());

                return `sourceMappingURL=/api/demo-react-asset?slug=${encodedSlug}&file=${mapPath}`;
            }
        );
        // console.log('Content After replacement', content);

        return new NextResponse(content, {
            headers: {
                "Content-Type": mimeType,
                "Cache-Control": "public, max-age=3600",
                "Access-Control-Allow-Origin": "*",
            },
        });
    }

    // ── Default: binary assets ──
    const buffer = fs.readFileSync(resolvedPath);

    // console.log('Default Binary Assets', buffer);
    return new NextResponse(buffer, {
        headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=3600",
            "Access-Control-Allow-Origin": "*",
        },
    });
}