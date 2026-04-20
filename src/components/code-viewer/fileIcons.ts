// Maps file extensions to a color class and short label
// Used in the file tree to visually distinguish file types

export interface FileIconInfo {
    color: string;    // tailwind text color class
    label: string;    // 2-3 char label shown as the "icon"
    bg: string;    // tailwind bg class for the dot
}

const EXT_MAP: Record<string, FileIconInfo> = {
    // React / JS / TS
    tsx: { color: "text-cyan-500", bg: "bg-cyan-500", label: "TSX" },
    jsx: { color: "text-cyan-400", bg: "bg-cyan-400", label: "JSX" },
    ts: { color: "text-blue-500", bg: "bg-blue-500", label: "TS" },
    js: { color: "text-yellow-400", bg: "bg-yellow-400", label: "JS" },
    mjs: { color: "text-yellow-400", bg: "bg-yellow-400", label: "JS" },

    // Markup / Style
    html: { color: "text-orange-500", bg: "bg-orange-500", label: "HTM" },
    css: { color: "text-blue-400", bg: "bg-blue-400", label: "CSS" },
    scss: { color: "text-pink-500", bg: "bg-pink-500", label: "SCO" },
    svg: { color: "text-green-400", bg: "bg-green-400", label: "SVG" },

    // Java / Backend
    java: { color: "text-red-500", bg: "bg-red-500", label: "JAV" },
    xml: { color: "text-orange-400", bg: "bg-orange-400", label: "XML" },
    gradle: { color: "text-teal-500", bg: "bg-teal-500", label: "GRD" },

    // Data / Config
    json: { color: "text-amber-400", bg: "bg-amber-400", label: "JSN" },
    yaml: { color: "text-red-400", bg: "bg-red-400", label: "YML" },
    yml: { color: "text-red-400", bg: "bg-red-400", label: "YML" },
    toml: { color: "text-orange-300", bg: "bg-orange-300", label: "TOM" },
    env: { color: "text-yellow-300", bg: "bg-yellow-300", label: "ENV" },

    // SQL
    sql: { color: "text-amber-500", bg: "bg-amber-500", label: "SQL" },

    // Docs
    md: { color: "text-slate-400", bg: "bg-slate-400", label: "MD" },
    txt: { color: "text-slate-400", bg: "bg-slate-400", label: "TXT" },
    pdf: { color: "text-red-400", bg: "bg-red-400", label: "PDF" },

    // Shell
    sh: { color: "text-green-500", bg: "bg-green-500", label: "SH" },
    bash: { color: "text-green-500", bg: "bg-green-500", label: "BSH" },

    // Images
    png: { color: "text-purple-400", bg: "bg-purple-400", label: "IMG" },
    jpg: { color: "text-purple-400", bg: "bg-purple-400", label: "IMG" },
    jpeg: { color: "text-purple-400", bg: "bg-purple-400", label: "IMG" },
    gif: { color: "text-purple-400", bg: "bg-purple-400", label: "IMG" },
    ico: { color: "text-purple-300", bg: "bg-purple-300", label: "ICO" },
    webp: { color: "text-purple-400", bg: "bg-purple-400", label: "IMG" },
};

const FOLDER_INFO: FileIconInfo = {
    color: "text-brand-400",
    bg: "bg-brand-400",
    label: "DIR",
};

const DEFAULT_INFO: FileIconInfo = {
    color: "text-slate-400",
    bg: "bg-slate-400",
    label: "FILE",
};

export function getFileIcon(ext: string | undefined, isDir: boolean): FileIconInfo {
    if (isDir) return FOLDER_INFO;
    if (!ext) return DEFAULT_INFO;
    return EXT_MAP[ext.toLowerCase()] ?? DEFAULT_INFO;
}

// Map extension to shiki language id
export function getLanguage(ext: string | undefined): string {
    const map: Record<string, string> = {
        tsx: "tsx",
        jsx: "jsx",
        ts: "typescript",
        js: "javascript",
        mjs: "javascript",
        html: "html",
        css: "css",
        scss: "scss",
        java: "java",
        xml: "xml",
        json: "json",
        yaml: "yaml",
        yml: "yaml",
        toml: "toml",
        sql: "sql",
        md: "markdown",
        sh: "bash",
        bash: "bash",
        gradle: "groovy",
        txt: "text",
        svg: "xml",
        env: "bash",
    };
    return map[ext?.toLowerCase() ?? ""] ?? "text";
}