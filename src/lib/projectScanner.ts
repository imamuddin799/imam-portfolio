import fs from "fs";
import path from "path";
import { Project, ProjectType, FileNode } from "@/lib/types";

// turbopackIgnore: true
const PROJECTS_ROOT = path.join(
  /*turbopackIgnore: true*/ process.cwd(),
    "projects",
    "imamuddin"
);

const IGNORE_LIST = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
    ".DS_Store",
    "Thumbs.db",
    ".env",
    ".env.local",
    ".env.production",
]);

const SHOW_ENV_FILES = new Set([".env.example", ".env.sample"]);

// ─── Detect project type ──────────────────────────────────────────────────────

function detectProjectType(dirPath: string): ProjectType {
    const files = fs.readdirSync(dirPath);
    const fileSet = new Set(files.map((f) => f.toLowerCase()));

    if (fileSet.has("pom.xml") || fileSet.has("build.gradle")) return "springboot";

    if (fileSet.has("package.json")) {
        try {
            const pkg = JSON.parse(
                fs.readFileSync(path.join(dirPath, "package.json"), "utf-8")
            );
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps["react"]) return "react";
        } catch {
            return "react";
        }
    }

    if (files.some((f) => f.endsWith(".java"))) return "java";
    if (files.some((f) => f.endsWith(".sql"))) return "sql";
    if (fileSet.has("index.html")) return "html-js";

    return "other";
}

// ─── Check .env ───────────────────────────────────────────────────────────────

function hasEnvFile(dirPath: string): boolean {
    return fs.readdirSync(dirPath).some(
        (f) => f.startsWith(".env") && !SHOW_ENV_FILES.has(f)
    );
}

// ─── Build file tree ──────────────────────────────────────────────────────────

function buildFileTree(dirPath: string, relativeTo: string): FileNode[] {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    for (const entry of entries) {
        if (IGNORE_LIST.has(entry.name)) continue;
        if (entry.name.startsWith(".env") && !SHOW_ENV_FILES.has(entry.name)) continue;

        const fullPath = path.join(dirPath, entry.name);
        const relPath = path.relative(relativeTo, fullPath);
        const ext = entry.isFile() ? entry.name.split(".").pop() ?? "" : undefined;

        if (entry.isDirectory()) {
            nodes.push({
                name: entry.name,
                path: relPath,
                type: "directory",
                children: buildFileTree(fullPath, relativeTo),
            });
        } else {
            nodes.push({ name: entry.name, path: relPath, type: "file", ext });
        }
    }

    return nodes.sort((a, b) => {
        if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
        return a.name.localeCompare(b.name);
    });
}

// ─── Generate tags ────────────────────────────────────────────────────────────

function generateTags(dirPath: string, type: ProjectType): string[] {
    const tags: string[] = [];
    if (type === "react") tags.push("React.js");
    if (type === "springboot") tags.push("Spring Boot", "Java");
    if (type === "java") tags.push("Java");
    if (type === "sql") tags.push("SQL");
    if (type === "html-js") tags.push("HTML", "CSS", "JavaScript");

    const pkgPath = path.join(dirPath, "package.json");
    if (fs.existsSync(pkgPath)) {
        try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };
            if (deps["typescript"] || deps["@types/react"]) tags.push("TypeScript");
            if (deps["tailwindcss"]) tags.push("Tailwind CSS");
            if (deps["axios"]) tags.push("Axios");
            if (deps["react-router-dom"]) tags.push("React Router");
            if (deps["redux"] || deps["@reduxjs/toolkit"]) tags.push("Redux");
            if (deps["next"]) tags.push("Next.js");
        } catch { /* ignore */ }
    }

    return [...new Set(tags)];
}

function slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ─── Scan single project ──────────────────────────────────────────────────────

function scanProject(
    dirPath: string,
    day: string | null,
    slugPath: string[]
): Project | null {

    // console.log('Scan Project');
    // console.log('DirPath', dirPath, 'Day', day, 'Slug Path', slugPath);
    try {
        const stats = fs.statSync(dirPath);
        const type = detectProjectType(dirPath);
        const tags = generateTags(dirPath, type);
        const fileTree = buildFileTree(dirPath, dirPath);
        const name = path.basename(dirPath);
        const id = slugPath.map(slugify).join("-");

        // console.log('Stats', stats);
        // console.log('Type', type);
        // console.log('Tags', tags);
        // console.log('File Tree', fileTree);
        // console.log('Name', name);
        // console.log('ID', id);

        return {
            id,
            title: name,
            description: `A ${type === "react" ? "React.js" : type.toUpperCase()} project — ${name}`,
            day,
            slug: slugPath,
            type,
            tags,
            hasLiveDemo: type === "react" || type === "html-js",
            hasEnvFile: hasEnvFile(dirPath),
            fileTree,
            createdAt: stats.birthtime.toISOString(),
        };
    } catch {
        return null;
    }
}

// ─── Check if directory is a project root ─────────────────────────────────────

function isProjectRoot(dirPath: string): boolean {

    // console.log('\nIs Project Root', dirPath, '\n');
    
    const files = fs.readdirSync(dirPath);
    const fileSet = new Set(files.map((f) => f.toLowerCase()));
    
    // console.log('Files in directory:', files);
    // console.log('File Set', fileSet);
    
    return (
        fileSet.has("package.json") ||
        fileSet.has("index.html") ||
        fileSet.has("pom.xml") ||
        fileSet.has("build.gradle") ||
        files.some((f) => f.endsWith(".java") || f.endsWith(".sql"))
    );
}

// ─── Main scanner ─────────────────────────────────────────────────────────────

export function scanAllProjects(): Project[] {
    if (!fs.existsSync(PROJECTS_ROOT)) return [];

    const projects: Project[] = [];
    const topLevel = fs.readdirSync(PROJECTS_ROOT, { withFileTypes: true });

    // console.log('Project Root', PROJECTS_ROOT);
    // console.log('Top Level:', topLevel);

    for (const topEntry of topLevel) {
        if (!topEntry.isDirectory()) continue;

        // console.log('Top Entry:', topEntry);
        // console.log('Top Entry Name:', topEntry.name);

        const topPath = path.join(PROJECTS_ROOT, topEntry.name);
        const dayLabel = topEntry.name.startsWith("Day") ? topEntry.name : null;

        // console.log('Top Path:', topPath);
        // console.log('Day Label:', dayLabel);

        // Top-level folder is itself a project
        if (isProjectRoot(topPath)) {
            // console.log('Top Path is a project root');
            const p = scanProject(topPath, dayLabel, [topEntry.name]);
            // console.log('Scanned Project:', p);
            if (p) projects.push(p);
            continue;
        }

        // console.log('Top Path', topPath, 'is not a project root, scanning children...');
        // Scan children (e.g. Day 2 → props-demo, another-project)
        const children = fs.readdirSync(topPath, { withFileTypes: true });

        // console.log('Children', children);

        for (const child of children) {
            if (!child.isDirectory()) continue;
            const childPath = path.join(/*turbopackIgnore: true*/ topPath, child.name);

            // console.log('Child Path:', childPath);

            if (isProjectRoot(childPath)) {
                // console.log('Child Path is a project root', childPath, 'Day Label:', dayLabel, 'Slug Path:', [topEntry.name, child.name]);
                const p = scanProject(childPath, dayLabel, [topEntry.name, child.name]);
                // console.log('Child Scanned Project:', p);
                if (p) projects.push(p);
            } else {
                // One more level deep (e.g. tasks/task1/)
                const grandchildren = fs.readdirSync(childPath, { withFileTypes: true });
                for (const gc of grandchildren) {
                    if (!gc.isDirectory()) continue;
                    const gcPath = path.join(/*turbopackIgnore: true*/ childPath, gc.name);
                    if (isProjectRoot(gcPath)) {
                        const p = scanProject(
                            gcPath,
                            dayLabel,
                            [topEntry.name, child.name, gc.name]
                        );
                        if (p) projects.push(p);
                    }
                }
            }
        }
    }

    return projects;
}

// ─── Get single project ───────────────────────────────────────────────────────

// export function getProjectBySlug(slug: string[]): Project | null {
//     console.log('Get Project By Slug, Received Slug:', slug);
//     const all = scanAllProjects();
//     const project = all.find((p) => JSON.stringify(p.slug) === JSON.stringify(slug)) ?? null
//     console.log('Found Project By Slug:', project);
//     return project;
// }

export function getProjectBySlug(slug: string[]): Project | null {
    // console.log("Get Project By Slug (Depth-aware):", slug);

    if (!slug?.length) return null;

    const basePath = path.join(PROJECTS_ROOT, ...slug);

    // सुरक्षा: prevent path traversal
    if (!basePath.startsWith(PROJECTS_ROOT)) {
        console.warn("Invalid path");
        return null;
    }

    if (!fs.existsSync(basePath)) {
        console.log("Path does not exist");
        return null;
    }

    const dayLabel = slug[0]?.startsWith("Day") ? slug[0] : null;

    // ── Case 1: exact path is project root ─────────────────────
    if (isProjectRoot(basePath)) {
        console.log("Direct project root");
        return scanProject(basePath, dayLabel, slug);
    }

    // ── Case 2: check children ─────────────────────────────────
    const children = fs.readdirSync(basePath, { withFileTypes: true });

    for (const child of children) {
        if (!child.isDirectory()) continue;

        const childPath = path.join(basePath, child.name);

        if (isProjectRoot(childPath)) {
            console.log("Found project at child level:", child.name);
            return scanProject(childPath, dayLabel, [...slug, child.name]);
        }

        // ── Case 3: check grandchildren (one more level) ────────
        const grandchildren = fs.readdirSync(childPath, { withFileTypes: true });

        for (const gc of grandchildren) {
            if (!gc.isDirectory()) continue;

            const gcPath = path.join(childPath, gc.name);

            if (isProjectRoot(gcPath)) {
                console.log("Found project at grandchild level:", gc.name);
                return scanProject(gcPath, dayLabel, [...slug, child.name, gc.name]);
            }
        }
    }

    // console.log("No project found");
    return null;
}

// ─── Get file content ─────────────────────────────────────────────────────────

export function getFileContent(slug: string[], filePath: string): string | null {
    const projectDir = path.join(
    /*turbopackIgnore: true*/ PROJECTS_ROOT,
        ...slug
    );
    const fullFilePath = path.join(projectDir, filePath);

    if (!fullFilePath.startsWith(projectDir)) return null;

    const basename = path.basename(fullFilePath);
    if (basename.startsWith(".env") && !SHOW_ENV_FILES.has(basename)) return null;

    try {
        return fs.readFileSync(fullFilePath, "utf-8");
    } catch {
        return null;
    }
}