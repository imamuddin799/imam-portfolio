import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PROJECTS_ROOT = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
    "projects",
    "imamuddin"
);

const MIME_TYPES: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    bmp: "image/bmp",
    tiff: "image/tiff",
    pdf: "application/pdf",
};

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get("slug");
    const filePath = searchParams.get("file");

    if (!slugParam || !filePath) {
        return new NextResponse("Missing params", { status: 400 });
    }

    const slug = decodeURIComponent(slugParam).split("/");
    const projectDir = path.join(PROJECTS_ROOT, ...slug);
    const fullPath = path.join(projectDir, filePath);

    // Security — must stay within projects root
    if (!fullPath.startsWith(PROJECTS_ROOT)) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    if (!fs.existsSync(fullPath)) {
        return new NextResponse("File not found", { status: 404 });
    }

    const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = MIME_TYPES[ext];

    if (!mimeType) {
        return new NextResponse("Not a previewable file", { status: 415 });
    }

    const buffer = fs.readFileSync(fullPath);

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": mimeType,
            "Cache-Control": "public, max-age=3600",
            // Allow PDF to render inline (not force download)
            "Content-Disposition": ext === "pdf"
                ? `inline; filename="${path.basename(filePath)}"`
                : "inline",
        },
    });
}