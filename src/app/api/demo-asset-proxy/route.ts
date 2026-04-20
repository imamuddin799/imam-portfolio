// FILE: src/app/api/demo-asset-proxy/route.ts
// PURPOSE: Legacy route kept for backward compatibility only.
//          Previously used path interception (/assets/* rewrite) which was unreliable.
//          Now simply redirects to demo-react-asset with the file param extracted from the URL.
//          New code uses demo-react-asset directly — this route is a safety fallback only.
// NOTE: You can delete this file safely if you are sure no old builds reference it.

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    // Try to get slug from referer header
    // e.g. Referer: http://localhost:3000/api/demo-react?slug=Tasks%2Fzomato
    const referer = req.headers.get("referer") ?? "";
    let slug = "";

    try {
        const refUrl = new URL(referer);
        const slugParam = refUrl.searchParams.get("slug");
        if (slugParam) slug = slugParam;
    } catch {
        // ignore
    }

    const file = searchParams.get("file") ?? "";

    if (!slug || !file) {
        return new NextResponse("Cannot resolve asset — use demo-react-asset directly", {
            status: 400,
        });
    }

    // Redirect to the correct asset route
    const redirectUrl = `/api/demo-react-asset?slug=${encodeURIComponent(slug)}&file=${encodeURIComponent(file)}`;

    return NextResponse.redirect(new URL(redirectUrl, req.url));
}