// ─── Project Types ──────────────────────────────────────────────────────────

export type ProjectType = "react" | "html-js" | "java" | "springboot" | "sql" | "other";

export type ProjectCategory =
    | "All"
    | "React"
    | "HTML/CSS/JS"
    | "Java"
    | "Spring Boot"
    | "SQL";

export type SortOption = "newest" | "oldest" | "az" | "za" | "day";

export interface FileNode {
    name: string;
    path: string;       // relative path from project root
    type: "file" | "directory";
    children?: FileNode[];  // only for directories
    ext?: string;       // file extension e.g. "tsx", "java"
}

export interface Project {
    id: string;       // slugified unique id e.g. "day-1-state"
    title: string;       // human readable e.g. "State Counter"
    description: string;
    day: string | null; // "Day 1", "Day 2", null for tasks
    slug: string[];      // path segments e.g. ["Day 1", "state"]
    type: ProjectType;
    tags: string[];
    hasLiveDemo: boolean;
    hasEnvFile: boolean;
    fileTree: FileNode[];
    createdAt: string;       // ISO date string
}

// ─── Skill Types ─────────────────────────────────────────────────────────────

export type SkillCategory = "All" | "Frontend" | "Backend" | "Database" | "DevOps";

export interface Skill {
    name: string;
    category: Exclude<SkillCategory, "All">;
    level: number; // 0-100
}

// ─── Theme Types ─────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";