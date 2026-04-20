import Link from "next/link";
import { Code2, Terminal, Database, Coffee, ArrowLeft } from "lucide-react";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { ProjectTypeBadge } from "@/components/projects/ProjectTypeBadge";
import { TECH_COLORS, PERSONAL_INFO } from "@/lib/constants";
import type { Project } from "@/lib/types";

interface Props {
    project: Project;
    slugPath: string;
}

const TYPE_REASONS: Record<string, {
    icon: React.ElementType;
    reason: string;
    howToRun: string;
}> = {
    java: {
        icon: Coffee,
        reason: "Java applications run on the JVM and cannot be executed in a browser.",
        howToRun: "javac Main.java && java Main",
    },
    springboot: {
        icon: Terminal,
        reason: "Spring Boot apps need a Java server environment to run.",
        howToRun: "mvn spring-boot:run  OR  ./gradlew bootRun",
    },
    sql: {
        icon: Database,
        reason: "SQL scripts need a database engine (MySQL, PostgreSQL, etc.) to execute.",
        howToRun: "mysql -u root -p < script.sql",
    },
    other: {
        icon: Terminal,
        reason: "This project type cannot be previewed directly in the browser.",
        howToRun: "Check the project README for run instructions.",
    },
};

export function DemoUnavailable({ project, slugPath }: Props) {
    const config = TYPE_REASONS[project.type] ?? TYPE_REASONS.other;
    const Icon = config.icon;

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-surface-light dark:bg-surface-dark">
            <div className="w-full max-w-lg animate-slide-up">

                <div className="rounded-3xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark overflow-hidden shadow-card-lg dark:shadow-card-dark">
                    <div className="h-1.5 w-full bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-600" />

                    <div className="p-8 flex flex-col items-center text-center gap-6">

                        {/* Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-white/5 border border-border-light dark:border-border-dark flex items-center justify-center">
                            <Icon size={36} className="text-slate-400 dark:text-slate-500" />
                        </div>

                        {/* Title */}
                        <div className="flex flex-col items-center gap-2">
                            <ProjectTypeBadge type={project.type} />
                            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                                {project.title}
                            </h2>
                            {project.day && (
                                <p className="text-sm text-slate-400 dark:text-slate-500">{project.day}</p>
                            )}
                        </div>

                        {/* Reason */}
                        <div className="px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border-light dark:border-border-dark w-full">
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                🚫{" "}
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                    Live demo not available.
                                </span>{" "}
                                {config.reason}
                            </p>
                        </div>

                        {/* How to run */}
                        <div className="w-full text-left">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                                How to run locally
                            </p>
                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 dark:bg-black/50 border border-border-dark">
                                <Terminal size={13} className="text-brand-400 shrink-0" />
                                <code className="text-xs text-green-400 font-mono flex-1 break-all">
                                    {config.howToRun}
                                </code>
                            </div>
                        </div>

                        {/* Tags */}
                        {project.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1.5 w-full">
                                {project.tags.map((tag) => {
                                    const cls = TECH_COLORS[tag] ?? TECH_COLORS["default"];
                                    return (
                                        <span
                                            key={tag}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${cls}`}
                                        >
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-3 w-full justify-center">
                            <Link
                                href={`/code/${slugPath}`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold transition-all duration-200 hover:shadow-glow"
                            >
                                <Code2 size={15} />
                                View Source Code
                            </Link>
                            <a
                                href={PERSONAL_INFO.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border-light dark:border-border-dark hover:border-brand-500/40 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 text-sm font-semibold transition-all duration-200"
                            >
                                <GithubIcon size={15} />
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>

                {/* Back */}
                <div className="flex justify-center mt-6">
                    <Link
                        href="/projects"
                        className="flex items-center gap-1.5 text-sm text-slate-400 dark:text-slate-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        Back to projects
                    </Link>
                </div>
            </div>
        </div>
    );
}