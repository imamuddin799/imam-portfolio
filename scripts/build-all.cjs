const fs = require("fs");
const path = require("path");
const execSync = require("child_process").execSync;

const PROJECTS_ROOT = path.join(__dirname, "..", "projects", "imamuddin");
const OUTPUT_ROOT = path.join(__dirname, "..", "public", "builds");

function log(msg) { console.log("\x1b[36m[build]\x1b[0m " + msg); }
function ok(msg) { console.log("\x1b[32m[  ok ]\x1b[0m " + msg); }
function warn(msg) { console.log("\x1b[33m[ warn]\x1b[0m " + msg); }
function fail(msg) { console.log("\x1b[31m[error]\x1b[0m " + msg); }

function isReactProject(dirPath) {
    const pkgPath = path.join(dirPath, "package.json");
    if (!fs.existsSync(pkgPath)) return false;

    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
        const deps = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {})
        };
        return !!deps["react"];
    } catch {
        return false;
    }
}

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    entries.forEach(entry => {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(s, d);
        } else {
            fs.copyFileSync(s, d);
        }
    });
}

/* ---------------------------
   PATCH: index.html only
---------------------------- */
function patchIndexHtml(indexPath, slugStr) {
    if (!fs.existsSync(indexPath)) return;

    let html = fs.readFileSync(indexPath, "utf-8");
    const encodedSlug = encodeURIComponent(slugStr);
    const assetBase = `/api/demo-react-asset?slug=${encodedSlug}&file=`;

    html = html.replace(/(src|href)="\/assets\//g, `$1="${assetBase}assets/`);
    html = html.replace(/url\((["']?)\/assets\//g, `url($1${assetBase}assets/`);

    fs.writeFileSync(indexPath, html, "utf-8");
    log("  Patched index.html");
}

/* ---------------------------
   PATCH: JS / CSS / HTML files
---------------------------- */
function patchAssetPathsInFiles(dir, slugStr) {
    const encodedSlug = encodeURIComponent(slugStr);
    const assetBase = `/api/demo-react-asset?slug=${encodedSlug}&file=`;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            patchAssetPathsInFiles(fullPath, slugStr);
            return;
        }

        if (!/\.(js|css|html)$/i.test(entry.name)) return;

        let content = fs.readFileSync(fullPath, "utf-8");

        // Replace "/assets/..."
        content = content.replace(/(["'`])\/assets\//g, `$1${assetBase}assets/`);

        // Replace url(/assets/...)
        content = content.replace(/url\((["']?)\/assets\//g, `url($1${assetBase}assets/`);

        fs.writeFileSync(fullPath, content, "utf-8");
    });

    log("  Patched JS/CSS/HTML asset paths");
}

/* ---------------------------
   FIND PROJECTS
---------------------------- */
function findReactProjects(rootDir, slugParts) {
    let results = [];
    if (!fs.existsSync(rootDir)) return results;

    const skip = ["node_modules", ".git", "dist", "build", ".next"];
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });

    entries.forEach(entry => {
        if (!entry.isDirectory()) return;
        if (skip.includes(entry.name)) return;

        const fullPath = path.join(rootDir, entry.name);
        const slug = [...slugParts, entry.name];

        if (isReactProject(fullPath)) {
            results.push({ fullPath, slug });
        } else {
            results = results.concat(findReactProjects(fullPath, slug));
        }
    });

    return results;
}

/* ---------------------------
   BUILD PROJECT
---------------------------- */
function buildProject(fullPath, slug) {
    const slugStr = slug.join("/");
    const destDir = path.join(OUTPUT_ROOT, ...slug);

    log(`Building: ${slugStr}`);

    if (!fs.existsSync(path.join(fullPath, "node_modules"))) {
        log("  Installing dependencies...");
        try {
            execSync("npm install --silent", { cwd: fullPath, stdio: "pipe" });
        } catch {
            fail(`  npm install failed for ${slugStr}`);
            return false;
        }
    }

    try {
        execSync("npm run build --silent", { cwd: fullPath, stdio: "pipe" });
    } catch {
        fail(`  npm run build failed for ${slugStr}`);
        return false;
    }

    const distPath = path.join(fullPath, "dist");
    const buildPath = path.join(fullPath, "build");

    let outPath = null;
    if (fs.existsSync(distPath)) outPath = distPath;
    else if (fs.existsSync(buildPath)) outPath = buildPath;

    if (!outPath) {
        warn(`  No dist/ or build/ folder found for ${slugStr}`);
        return false;
    }

    if (fs.existsSync(destDir)) {
        fs.rmSync(destDir, { recursive: true });
    }

    copyDir(outPath, destDir);

    // Patch assets everywhere
    patchIndexHtml(path.join(destDir, "index.html"), slugStr);
    patchAssetPathsInFiles(destDir, slugStr);

    ok(`  Done: public/builds/${slugStr}/`);
    return true;
}

/* ---------------------------
   MAIN EXECUTION
---------------------------- */
const targetSlug = process.argv[2] || null;
const allProjects = findReactProjects(PROJECTS_ROOT, []);

if (allProjects.length === 0) {
    warn("No React projects found in projects/imamuddin/");
    process.exit(0);
}

let toProcess = allProjects;

if (targetSlug) {
    toProcess = allProjects.filter(p => p.slug.join("/") === targetSlug);

    if (toProcess.length === 0) {
        fail(`No project found matching: ${targetSlug}`);
        process.exit(1);
    }
}

log(`Found ${toProcess.length} project(s) to build\n`);

let built = 0;
let failed = 0;

toProcess.forEach(p => {
    const success = buildProject(p.fullPath, p.slug);
    if (success) built++;
    else failed++;
    console.log("");
});

console.log("----------------------------------------");
ok(`${built} built successfully`);
if (failed > 0) fail(`${failed} failed`);
log("Done. Run: npm run dev");