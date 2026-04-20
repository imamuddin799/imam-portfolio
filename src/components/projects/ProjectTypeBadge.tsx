import type { ProjectType } from "@/lib/types";

const TYPE_CONFIG: Record<
    ProjectType,
    { label: string; className: string }
> = {
    react: {
        label: "React",
        className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
    "html-js": {
        label: "HTML/JS",
        className: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    },
    java: {
        label: "Java",
        className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    springboot: {
        label: "Spring Boot",
        className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    },
    sql: {
        label: "SQL",
        className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
    other: {
        label: "Other",
        className: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    },
};

interface Props {
    type: ProjectType;
    size?: "sm" | "md";
}

export function ProjectTypeBadge({ type, size = "md" }: Props) {
    const config = TYPE_CONFIG[type] ?? TYPE_CONFIG.other;
    return (
        <span
            className={`inline-flex items-center border rounded-lg font-semibold ${config.className} ${size === "sm"
                    ? "px-2 py-0.5 text-xs"
                    : "px-3 py-1 text-xs"
                }`}
        >
            {config.label}
        </span>
    );
}