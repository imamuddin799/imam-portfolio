// FILE: src/app/api/demo-asset/route.ts
// PURPOSE: Serves ANY static asset (CSS, JS, images, fonts) from a plain HTML/JS project folder.
//          Called via ?slug=Day3&file=style.css or ?slug=Day3&file=assets/logo.png
// USED BY: demo-html/route.ts rewrites all asset URLs in the HTML to point here.

import { NextRequest, NextResponse } from "next/server";
import fs   from "fs";
import path from "path";

const PROJECTS_ROOT = path.join(process.cwd(), "projects", "imamuddin");

const MIME: Record<string, string> = {
  js:    "application/javascript",
  mjs:   "application/javascript",
  css:   "text/css",
  html:  "text/html",
  json:  "application/json",
  png:   "image/png",
  jpg:   "image/jpeg",
  jpeg:  "image/jpeg",
  gif:   "image/gif",
  svg:   "image/svg+xml",
  webp:  "image/webp",
  ico:   "image/x-icon",
  woff:  "font/woff",
  woff2: "font/woff2",
  ttf:   "font/ttf",
  otf:   "font/otf",
  mp4:   "video/mp4",
  webm:  "video/webm",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slugParam = searchParams.get("slug");
  const filePath  = searchParams.get("file");

  if (!slugParam || !filePath) {
    return new NextResponse("Missing slug or file param", { status: 400 });
  }

  const slug       = decodeURIComponent(slugParam).split("/");
  const projectDir = path.join(PROJECTS_ROOT, ...slug);
  const fullPath   = path.join(projectDir, decodeURIComponent(filePath));

  // Security: must stay within projects root
  if (!fullPath.startsWith(PROJECTS_ROOT)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    return new NextResponse("Not found: " + filePath, { status: 404 });
  }

  const ext      = fullPath.split(".").pop()?.toLowerCase() ?? "";
  const mimeType = MIME[ext] ?? "application/octet-stream";
  const buffer   = fs.readFileSync(fullPath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":                mimeType,
      "Cache-Control":               "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}