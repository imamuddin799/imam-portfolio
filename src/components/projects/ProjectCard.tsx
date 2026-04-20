import Link from "next/link";
import {
    Play,
    Code2,
    Calendar,
    AlertTriangle,
    FolderOpen,
} from "lucide-react";
import { ProjectTypeBadge } from "@/components/projects/ProjectTypeBadge";
import { TECH_COLORS } from "@/lib/constants";
import type { Project } from "@/lib/types";

interface Props {
    project: Project;
}

export function ProjectCard({ project }: Props) {
    const slugPath = project.slug.join("/");
    const demoHref = `/demo/${slugPath}`;
    const codeHref = `/code/${slugPath}`;

    const visibleTags = project.tags.slice(0, 3);
    const extraTags = project.tags.length - 3;

    return (
        <div className="group flex flex-col rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark hover:border-brand-500/30 hover:shadow-card-lg dark:hover:shadow-card-dark transition-all duration-300 overflow-hidden hover:-translate-y-1">

            {/* Card top color strip based on type */}
            <div
                className={`h-1.5 w-full ${project.type === "react" ? "bg-gradient-to-r from-cyan-400 to-cyan-600" :
                        project.type === "html-js" ? "bg-gradient-to-r from-orange-400 to-orange-600" :
                            project.type === "java" ? "bg-gradient-to-r from-red-400 to-red-600" :
                                project.type === "springboot" ? "bg-gradient-to-r from-green-400 to-green-600" :
                                    project.type === "sql" ? "bg-gradient-to-r from-amber-400 to-amber-600" :
                                        "bg-gradient-to-r from-slate-400 to-slate-600"
                    }`}
            />

            <div className="flex flex-col flex-1 p-5 gap-4">

                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1.5 min-w-0">
                        {/* Day label */}
                        {project.day && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                                <Calendar size={11} />
                                <span>{project.day}</span>
                            </div>
                        )}

                        {/* Title */}
                        <h3 className="font-display font-bold text-base text-slate-900 dark:text-white truncate group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                            {project.title}
                        </h3>
                    </div>

                    <ProjectTypeBadge type={project.type} size="sm" />
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
                    {project.description}
                </p>

                {/* .env warning */}
                {project.hasEnvFile && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
                        <AlertTriangle size={12} className="shrink-0" />
                        Requires environment variables
                    </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {visibleTags.map((tag) => {
                        const colorClass = TECH_COLORS[tag] ?? TECH_COLORS["default"];
                        return (
                            <span
                                key={tag}
                                className={`px-2 py-0.5 rounded-md text-xs font-medium border ${colorClass}`}
                            >
                                {tag}
                            </span>
                        );
                    })}
                    {extraTags > 0 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium border border-border-light dark:border-border-dark text-slate-400 dark:text-slate-500">
                            +{extraTags} more
                        </span>
                    )}
                </div>

                {/* File count */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                    <FolderOpen size={12} />
                    <span>{project.fileTree.length} items in root</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1 border-t border-border-light dark:border-border-dark mt-auto">
                    {project.hasLiveDemo ? (
                        <Link
                            href={demoHref}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-glow"
                        >
                            <Play size={13} />
                            Live Demo
                        </Link>
                    ) : (
                        <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 text-sm font-medium cursor-not-allowed">
                            <Play size={13} />
                            No Demo
                        </div>
                    )}

                    <Link
                        href={codeHref}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border-light dark:border-border-dark hover:border-brand-500/50 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 text-sm font-semibold transition-all duration-200"
                    >
                        <Code2 size={13} />
                        View Code
                    </Link>
                </div>
            </div>
        </div>
    );
}