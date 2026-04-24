var fs = require("fs");
var path = require("path");

var PROJECTS_ROOT = path.join(__dirname, "..", "projects", "imamuddin");

// CLI args
var slugArg = process.argv.find(arg => arg.startsWith("--slug="));
var targetSlug = slugArg ? slugArg.split("=")[1] : null;

var dryRun = process.argv.includes("--dry");

/* ---------------------------
   LOG HELPERS
---------------------------- */
function log(msg) { console.log("\x1b[36m[clean]\x1b[0m " + msg); }
function ok(msg) { console.log("\x1b[32m[  ok  ]\x1b[0m " + msg); }
function warn(msg) { console.log("\x1b[33m[ warn ]\x1b[0m " + msg); }
function sep() { console.log("--------------------------------------------------"); }

/* ---------------------------
   DELETE SAFE
---------------------------- */
function removeDirSafe(dirPath) {
    if (!fs.existsSync(dirPath)) return false;

    if (dryRun) {
        log("[dry-run] Would delete: " + dirPath);
        return true;
    }

    fs.rmSync(dirPath, { recursive: true, force: true });
    return true;
}

/* ---------------------------
   FIND PROJECTS
---------------------------- */
function findProjectRoots(dir) {
    let results = [];

    if (!fs.existsSync(dir)) return results;

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);

        if (!fs.statSync(fullPath).isDirectory()) continue;

        const hasPackageJson = fs.existsSync(path.join(fullPath, "package.json"));

        if (hasPackageJson) {
            results.push(fullPath);
        } else {
            // go deeper
            results = results.concat(findProjectRoots(fullPath));
        }
    }

    return results;
}


/* ---------------------------
START
---------------------------- */
sep();
log("Cleaning Projects (node_modules + build)");
if (targetSlug) log("Target slug: " + targetSlug);
if (dryRun) warn("Dry run enabled (no deletion)");
sep();

var projects = findProjectRoots(PROJECTS_ROOT);

if (projects.length === 0) {
    warn("No projects found");
    process.exit(0);
}

/* ---------------------------
   LOOP PROJECTS
---------------------------- */
projects.forEach(projectPath => {
    log("Found project root: " + projectPath);
    var projectName = path.basename(projectPath);

    if (targetSlug && !projectPath.includes(targetSlug)) {
        return;
    }

    log("Processing: " + projectName);

    var nodeModules = path.join(projectPath, "node_modules");
    var dist = path.join(projectPath, "dist");
    var build = path.join(projectPath, "build");
    var next = path.join(projectPath, ".next");
    var out = path.join(projectPath, "out");

    var deleted = false;

    deleted = removeDirSafe(nodeModules) || deleted;
    deleted = removeDirSafe(dist) || deleted;
    deleted = removeDirSafe(build) || deleted;
    deleted = removeDirSafe(next) || deleted;
    deleted = removeDirSafe(out) || deleted;

    if (deleted) {
        ok("Cleaned: " + projectName);
    } else {
        warn("Nothing to clean: " + projectName);
    }

    sep();
});

ok("Cleanup completed.");