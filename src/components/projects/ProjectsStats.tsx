import { FolderGit2, Globe, Code2, Database } from "lucide-react";
import type { Project, ProjectType } from "@/lib/types";

interface Props {
    projects: Project[];
    filtered: number;
    total: number;
}

const TYPE_GROUPS: {
    label: string;
    icon: React.ElementType;
    types: ProjectType[];
    color: string;
    bg: string;
}[] = [
        {
            label: "React / Next.js",
            icon: Globe,
            types: ["react"],
            color: "text-cyan-500",
            bg: "bg-cyan-500/10",
        },
        {
            label: "HTML / JS",
            icon: Code2,
            types: ["html-js"],
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
        {
            label: "Java / Spring",
            icon: FolderGit2,
            types: ["java", "springboot"],
            color: "text-red-500",
            bg: "bg-red-500/10",
        },
        {
            label: "SQL / Other",
            icon: Database,
            types: ["sql", "other"],
            color: "text-amber-500",
            bg: "bg-amber-500/10",
        },
    ];

export function ProjectsStats({ projects, filtered, total }: Props) {
    return (
        <div className="mb-10">
            {/* Total + filtered count */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                        My Projects
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        {filtered === total
                            ? `${total} projects built while learning`
                            : `Showing ${filtered} of ${total} projects`}
                    </p>
                </div>

                {/* Live count pill */}
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-brand-500/30 bg-brand-500/5">
                    <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
                    <span className="text-brand-600 dark:text-brand-400 text-sm font-semibold">
                        {total} Total Projects
                    </span>
                </div>
            </div>

            {/* Breakdown cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {TYPE_GROUPS.map((group) => {
                    const count = projects.filter((p) =>
                        group.types.includes(p.type)
                    ).length;
                    const Icon = group.icon;
                    return (
                        <div
                            key={group.label}
                            className="flex items-center gap-3 p-4 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark"
                        >
                            <div className={`w-9 h-9 rounded-xl ${group.bg} flex items-center justify-center shrink-0`}>
                                <Icon size={16} className={group.color} />
                            </div>
                            <div>
                                <p className={`text-xl font-bold font-display ${group.color}`}>
                                    {count}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                                    {group.label}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}