// FILE: src/app/api/demo-status/route.ts
// PURPOSE: Shown INSIDE the iframe when a React project exists but hasn't been built yet.
//          Displays instructions on how to build the project using build-all.cjs.
//          Returns a self-contained HTML page with no external dependencies.
// USED BY: demoResolver.ts returns this URL when type="react" but no build folder found.

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "unknown";
  const type = searchParams.get("type") ?? "react";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Build Required</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0f1a;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem;
    }
    .card {
      background: #111827;
      border: 1px solid #1e293b;
      border-radius: 1.25rem;
      padding: 2.5rem;
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    .icon { font-size: 3rem; margin-bottom: 1.25rem; }
    h2 { color: #f1f5f9; font-size: 1.2rem; font-weight: 700; margin-bottom: .75rem; }
    p { font-size: .875rem; line-height: 1.6; margin-bottom: 1.25rem; }
    .cmd-box {
      background: #0d1117;
      border: 1px solid #1e293b;
      border-radius: .75rem;
      padding: 1rem 1.25rem;
      text-align: left;
      margin-bottom: 1.25rem;
    }
    .cmd-label {
      font-size: .7rem;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: #475569;
      margin-bottom: .5rem;
    }
    code {
      font-family: 'Fira Code', 'Cascadia Code', monospace;
      font-size: .8rem;
      color: #38bdf8;
      display: block;
      line-height: 1.9;
    }
    .note {
      font-size: .75rem;
      color: #475569;
      margin-top: 1rem;
    }
    .note code {
      display: inline;
      background: #1e293b;
      padding: .1em .4em;
      border-radius: .3em;
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⚙️</div>
    <h2>Build Required</h2>
    <p>
      This is a <strong style="color:#38bdf8">${type === "react" ? "React / Vite" : type}</strong> project.
      It needs to be built before it can be previewed in the browser.
    </p>
    <div class="cmd-box">
      <div class="cmd-label">Run in your terminal</div>
      <code>cd "projects/imamuddin/${slug}"</code>
      <code>npm install</code>
      <code>npm run build</code>
    </div>
    <p class="note">
      Or build all projects at once from the imam-portfolio root:<br/>
      <code>node scripts/build-all.cjs</code><br/>
      or just this one:<br/>
      <code>node scripts/build-all.cjs "${slug}"</code>
    </p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}