// FILE: src/app/api/demo-react/route.ts
// PURPOSE: Serves the built index.html for React/Vite projects from public/builds/<slug>/.
//          Rewrites ALL asset references to go through demo-react-asset API.
//          Injects a runtime JS shim to catch dynamic image loads from the JS bundle.
// USED BY: demoResolver.ts returns this URL for type="react" projects that have been built.

import { NextRequest, NextResponse } from "next/server";
import fs   from "fs";
import path from "path";

const BUILDS_ROOT = path.join(process.cwd(), "public", "builds");

export async function GET(req: NextRequest) {
  // console.log('demo-react execution start');
  const { searchParams } = new URL(req.url);
  const slugParam = searchParams.get("slug");

  // console.log('Search Param>>>', searchParams);
  // console.log('Slug Param>>>', slugParam);
  if (!slugParam) {
    return new NextResponse("Missing slug param", { status: 400 });
  }

  const slug      = decodeURIComponent(slugParam).split("/");
  const buildDir  = path.join(BUILDS_ROOT, ...slug);
  const indexPath = path.join(buildDir, "index.html");

  // console.log('Decoded URI Component>>>', slug);
  // console.log('Build Directory>>>', buildDir);
  // console.log('Index Path>>>', indexPath);

  // Security
  if (!buildDir.startsWith(BUILDS_ROOT)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(indexPath)) {
    return new NextResponse(buildNotFoundHtml(slug.join("/")), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  let html = fs.readFileSync(indexPath, "utf-8");
  const encodedSlug = encodeURIComponent(slugParam);
  const apiBase     = `/api/demo-react-asset?slug=${encodedSlug}&file=`;
  // console.log('index html', html);
  // console.log('encodedSlug', encodedSlug);
  // console.log('apiBase', apiBase);


  // Rewrite src="..." and href="..." that are local paths (not already API routes, not external)
  html = html.replace(/(src|href)="([^"]+)"/g, (match, attr, val) => {
    // Skip: external URLs, data URIs, anchors, empty, already pointing to our API
    if (
      !val ||
      val.startsWith("http") ||
      val.startsWith("//") ||
      val.startsWith("data:") ||
      val.startsWith("#") ||
      val.startsWith("/api/")
    ) return match;

    // Strip leading slash for the file param
    const filePart = val.startsWith("/") ? val.slice(1) : val;
    return `${attr}="${apiBase}${filePart}"`;
  });

  // console.log('Rewritten html replaced paths:', html);

  // Rewrite url(/...) in inline styles — skip already-rewritten and external
  html = html.replace(/url\(["']?([^"')]+)["']?\)/g, (match, val) => {
    if (
      !val ||
      val.startsWith("http") ||
      val.startsWith("data:") ||
      val.startsWith("/api/") ||
      val.startsWith("blob:")
    ) return match;

    const filePart = val.startsWith("/") ? val.slice(1) : val;
    return `url("${apiBase}${filePart}")`;
  });

  // console.log('Rewritten html replaced urls:', html);

  // Runtime shim — catches dynamic asset loads from the JS bundle at runtime.
  // These can't be patched at HTML level since Vite generates them dynamically.
  // The shim intercepts img.src assignments, fetch, and XHR.
  const shim = `<script>
(function(){
  var SLUG = "${encodedSlug}";
  var API  = "/api/demo-react-asset?slug=" + SLUG + "&file=";

  // Only rewrite local absolute paths like /assets/logo.webp
  function shouldRewrite(url) {
    if (!url || typeof url !== "string") return false;
    if (url.startsWith("data:") || url.startsWith("blob:") || url.startsWith("http") || url.startsWith("//")) return false;
    if (url.startsWith("/api/")) return false; // already rewritten
    if (url.startsWith("/")) return true;
    return false;
  }

  function rewrite(url) {
    return shouldRewrite(url) ? API + url.slice(1) : url;
  }

  // Patch img elements via MutationObserver
  function fixImg(img) {
    var src = img.getAttribute("src");
    if (shouldRewrite(src)) img.setAttribute("src", rewrite(src));
    var srcset = img.getAttribute("srcset");
    if (srcset) {
      img.setAttribute("srcset", srcset.replace(/([^\s,]+)\s*/g, function(m, u) {
        return shouldRewrite(u) ? rewrite(u) + " " : m;
      }));
    }
  }

  new MutationObserver(function(muts) {
    muts.forEach(function(m) {
      m.addedNodes.forEach(function(n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === "IMG") fixImg(n);
        var imgs = n.querySelectorAll ? n.querySelectorAll("img") : [];
        for (var i = 0; i < imgs.length; i++) fixImg(imgs[i]);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });

  // Patch fetch
  var _fetch = window.fetch;
  window.fetch = function(input, init) {
    if (typeof input === "string" && shouldRewrite(input)) input = rewrite(input);
    return _fetch.call(this, input, init);
  };

  // Patch XHR
  var _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[1] === "string" && shouldRewrite(args[1])) args[1] = rewrite(args[1]);
    return _open.apply(this, args);
  };
})();
</script>`;

  html = html.includes("<head>")
    ? html.replace("<head>", "<head>" + shim)
    : shim + html;
  // console.log('shim+html', html);
  return new NextResponse(html, {
    headers: {
      "Content-Type":            "text/html; charset=utf-8",
      "X-Frame-Options":         "SAMEORIGIN",
      "Content-Security-Policy": "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
    },
  });
}

function buildNotFoundHtml(slug: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>body{font-family:sans-serif;background:#0a0f1a;color:#94a3b8;
display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem;}
.card{background:#111827;border:1px solid #1e293b;border-radius:1.25rem;
padding:2.5rem;max-width:480px;width:100%;text-align:center;}
h2{color:#f1f5f9;margin-bottom:.75rem;}
.cmd{background:#0d1117;border:1px solid #1e293b;border-radius:.75rem;padding:1rem;text-align:left;margin:1rem 0;}
code{font-family:monospace;font-size:.8rem;color:#38bdf8;display:block;line-height:2;}
</style></head><body><div class="card">
<div style="font-size:3rem;margin-bottom:1rem">⚙️</div>
<h2>Build Required</h2>
<p>This React project needs to be built before it can be previewed.</p>
<div class="cmd">
<code>cd projects/imamuddin/${slug}</code>
<code>npm install</code>
<code>npm run build</code>
</div>
<p style="font-size:.75rem;color:#475569">
Or run from imam-portfolio root:<br/>
<code style="display:inline;background:#1e293b;padding:.15em .5em;border-radius:.3em">node scripts/build-all.cjs "${slug}"</code>
</p>
</div></body></html>`;
}