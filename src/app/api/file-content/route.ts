// FILE: src/app/api/file-content/route.ts
// PURPOSE: Reads a file from projects/imamuddin/ and returns its content
//          plus TWO syntax-highlighted versions (dark + light) via shiki.
//          The client picks which one to display based on current theme.

import { NextRequest, NextResponse } from "next/server";
import { getFileContent } from "@/lib/projectScanner";
import { getLanguage } from "@/components/code-viewer/fileIcons";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slugParam = searchParams.get("slug");
    const filePath = searchParams.get("file");

    if (!slugParam || !filePath) {
        return NextResponse.json({ error: "Missing params" }, { status: 400 });
    }

    const slug = slugParam.split("/");
    const content = getFileContent(slug, filePath);

    if (content === null) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const ext = filePath.split(".").pop();
    const language = getLanguage(ext);

    let highlightedDark: string | null = null;
    let highlightedLight: string | null = null;

    try {
        const { codeToHtml } = await import("shiki");

        // Dark theme — GitHub Dark (deep, high contrast)
        highlightedDark = await codeToHtml(content, {
            lang: language,
            theme: "github-dark",
        });

        // Light theme — GitHub Light (clean, clearly readable)
        highlightedLight = await codeToHtml(content, {
            lang: language,
            theme: "github-light",
        });
    } catch {
        // Unknown language — fall back to plain text display
        highlightedDark = null;
        highlightedLight = null;
    }

    return NextResponse.json({
        content,
        highlightedDark,
        highlightedLight,
    });
}