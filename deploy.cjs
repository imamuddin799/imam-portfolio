// var execSync = require("child_process").execSync;
// var fs = require("fs");
// var path = require("path");

// var isProd = process.argv.includes("--prod");
// var skipBuild = process.argv.includes("--skip-build");

// function log(msg) { console.log("\x1b[36m[deploy]\x1b[0m " + msg); }
// function ok(msg) { console.log("\x1b[32m[  ok  ]\x1b[0m " + msg); }
// function warn(msg) { console.log("\x1b[33m[ warn ]\x1b[0m " + msg); }
// function fail(msg) { console.log("\x1b[31m[ fail ]\x1b[0m " + msg); process.exit(1); }
// function sep() { console.log("--------------------------------------------------"); }

// sep();
// log("imam-portfolio Deployment Script");
// log("Mode: " + (isProd ? "PRODUCTION" : "Preview"));
// sep();

// log("Step 1: Checking Vercel CLI...");
// try {
//     execSync("vercel --version", { stdio: "pipe" });
//     ok("Vercel CLI found");
// } catch (e) {
//     fail("Vercel CLI not found. Run: npm install -g vercel");
// }

// if (!skipBuild) {
//     log("Step 2: Building React projects...");
//     var buildScript = path.join(__dirname, "scripts", "build-all.cjs");
//     if (!fs.existsSync(buildScript)) {
//         warn("build-all.cjs not found, skipping React builds");
//     } else {
//         try {
//             execSync("node " + buildScript, { stdio: "inherit" });
//             ok("All React projects built");
//         } catch (e) {
//             warn("Some projects failed to build, continuing anyway");
//         }
//     }
// } else {
//     log("Step 2: Skipping React builds");
// }

// sep();

// log("Step 3: Deploying to Vercel...");
// var vercelCmd = isProd ? "vercel --prod --yes" : "vercel --yes";

// try {
//     execSync(vercelCmd, { stdio: "inherit", cwd: __dirname });
//     sep();
//     ok("Deployment complete!");
//     if (isProd) {
//         ok("Live at: https://imamuddin-ansari.vercel.app");
//     } else {
//         log("Preview deployment done. For production: node deploy.cjs --prod");
//     }
// } catch (e) {
//     fail("Deployment failed. Check the output above.");
// }


var execSync = require("child_process").execSync;
var fs = require("fs");
var path = require("path");

var isProd = process.argv.includes("--prod");
var skipBuild = process.argv.includes("--skip-build");

// Support: --slug=abc/xyz
var slugArg = process.argv.find(arg => arg.startsWith("--slug="));
var targetSlug = slugArg ? slugArg.split("=")[1] : null;

var OUTPUT_ROOT = path.join(__dirname, "public", "builds");

function log(msg) { console.log("\x1b[36m[deploy]\x1b[0m " + msg); }
function ok(msg) { console.log("\x1b[32m[  ok  ]\x1b[0m " + msg); }
function warn(msg) { console.log("\x1b[33m[ warn ]\x1b[0m " + msg); }
function fail(msg) { console.log("\x1b[31m[ fail ]\x1b[0m " + msg); process.exit(1); }
function sep() { console.log("--------------------------------------------------"); }

/* ---------------------------
   VALIDATE BUILDS
---------------------------- */
function hasBuildOutput() {
    if (!fs.existsSync(OUTPUT_ROOT)) return false;

    const entries = fs.readdirSync(OUTPUT_ROOT);
    return entries.length > 0;
}

/* ---------------------------
   START
---------------------------- */
sep();
log("Imam-Portfolio Deployment Script");
log("Mode: " + (isProd ? "PRODUCTION" : "Preview"));
if (targetSlug) log("Target slug: " + targetSlug);
sep();

/* ---------------------------
   STEP 1: VERCEL CLI
---------------------------- */
log("Step 1: Checking Vercel CLI...");
try {
    execSync("vercel --version", { stdio: "pipe" });
    ok("Vercel CLI found");
} catch (e) {
    fail("Vercel CLI not found. Run: npm install -g vercel");
}

/* ---------------------------
   STEP 2: BUILD PROJECTS
---------------------------- */
if (!skipBuild) {
    log("Step 2: Building React projects...");

    var buildScript = path.join(__dirname, "scripts", "build-all.cjs");

    if (!fs.existsSync(buildScript)) {
        warn("build-all.cjs not found, skipping builds");
    } else {
        try {
            let cmd = "node " + buildScript;
            if (targetSlug) cmd += " " + targetSlug;

            execSync(cmd, { stdio: "inherit" });
            ok("Build step completed");
        } catch (e) {
            warn("Some builds failed (continuing)");
        }
    }

    // 🔥 Critical validation
    if (!hasBuildOutput()) {
        fail("No build output found in public/builds. Aborting deployment.");
    } else {
        ok("Build output verified");
    }
} else {
    log("Step 2: Skipping React builds");

    if (!hasBuildOutput()) {
        fail("Skip-build used but no existing builds found.");
    }
}

sep();

/* ---------------------------
   STEP 3: DEPLOY
---------------------------- */
log("Step 3: Deploying to Vercel...");

var vercelCmd = isProd ? "vercel --prod --yes" : "vercel --yes";

try {
    execSync(vercelCmd, { stdio: "inherit", cwd: __dirname });

    sep();
    ok("Deployment complete!");

    if (isProd) {
        ok("Live at: https://imamuddin-ansari.vercel.app");
    } else {
        log("Preview deployment done.");
        log("For production: node deploy.cjs --prod");
    }

} catch (e) {
    fail("Deployment failed. Check logs above.");
}