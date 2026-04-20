// FILE: src/app/api/demo-html/route.ts
// PURPOSE: Serves plain HTML/JS projects (Day 3 style — just index.html, no package.json).
//          Reads index.html, rewrites ALL asset URLs (relative and absolute) to go through
//          /api/demo-asset?slug=...&file=... so assets load correctly inside the iframe.
// USED BY: demoResolver.ts returns this URL for projects with type "html-js"

import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECTS_ROOT = path.join(process.cwd(), "projects", "imamuddin");

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get("slug");

    if (!slugParam) {
        return new NextResponse("Missing slug param", { status: 400 });
    }

    const slug = decodeURIComponent(slugParam).split("/");
    const projectDir = path.join(PROJECTS_ROOT, ...slug);
    const indexPath = path.join(projectDir, "index.html");

    // Security
    if (!projectDir.startsWith(PROJECTS_ROOT)) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(indexPath)) {
        return new NextResponse(noIndexHtml(slug.join("/")), {
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    }

    let html = fs.readFileSync(indexPath, "utf-8");

    // Base URL for all assets served through our API
    const base = `/api/demo-asset?slug=${encodeURIComponent(slugParam)}&file=`;

    // Rewrite src="./foo.js"  →  src="/api/demo-asset?slug=...&file=foo.js"
    html = html.replace(/\s(src|href)="(?!http|https|\/\/|#|data:)([^"]+)"/g, (_, attr, val) => {
        const clean = val.replace(/^\.\//, "");
        return ` ${attr}="${base}${encodeURIComponent(clean)}"`;
    });

    // Rewrite url('./foo.png') in inline styles
    html = html.replace(/url\(['"]?(?!http|https|data:)\.?\/?([^'")]+)['"]?\)/g, (_, val) => {
        return `url("${base}${encodeURIComponent(val)}")`;
    });

    return new NextResponse(html, {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Frame-Options": "SAMEORIGIN",
            "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
        },
    });
}

function noIndexHtml(slug: string): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;
height:100vh;margin:0;background:#0a0f1a;color:#94a3b8;}
.box{text-align:center;padding:2rem;border:1px dashed #1e293b;border-radius:1rem;}
code{background:#1e293b;padding:.2em .5em;border-radius:.4em;color:#38bdf8;}</style></head>
<body><div class="box">
<p>No <code>index.html</code> found in <code>${slug}</code></p>
</div></body></html>`;
}