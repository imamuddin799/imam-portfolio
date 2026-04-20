import fs from "fs";
import path from "path";
import type { Project } from "@/lib/types";

/**
 * Returns the URL to load inside the iframe for a given project.
 *
 * ALL demos go through API routes so we can inject the correct
 * <base> tag and fix asset paths regardless of where files live.
 */
export function resolveDemoSrc(project: Project): string | null {
    if (!project.hasLiveDemo) return null;

    const slugStr = encodeURIComponent(project.slug.join("/"));

    if (project.type === "react") {
        // Check if a build exists in public/builds/
        const buildDir = path.join(
            process.cwd(),
            "public",
            "builds",
            ...project.slug
        );
        const hasBuilt = fs.existsSync(path.join(buildDir, "index.html"));

        if (hasBuilt) {
            // Serve through API so we can inject correct base tag
            return `/api/demo-react?slug=${slugStr}`;
        }

        // Not built yet — show instructions inside iframe
        return `/api/demo-status?slug=${project.slug.join("/")}&type=react`;
    }

    if (project.type === "html-js") {
        return `/api/demo-html?slug=${slugStr}`;
    }

    return null;
}