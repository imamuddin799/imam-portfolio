"use client";

import Link from "next/link";
import { useState } from "react";
import {
    ArrowLeft,
    Code2,
    ExternalLink,
    Monitor,
    Tablet,
    Smartphone,
    RefreshCw,
} from "lucide-react";
import { ProjectTypeBadge } from "@/components/projects/ProjectTypeBadge";
import type { Project } from "@/lib/types";

type Viewport = "desktop" | "tablet" | "mobile";

interface Props {
    project: Project;
    slugPath: string;
    demoSrc: string;
    viewport: Viewport;
    onViewport: (v: Viewport) => void;
    onRefresh: () => void;
}

const VIEWPORT_BUTTONS: {
    mode: Viewport;
    icon: React.ElementType;
    label: string;
    title: string;
}[] = [
        { mode: "desktop", icon: Monitor, label: "Desktop", title: "Desktop view" },
        { mode: "tablet", icon: Tablet, label: "Tablet", title: "Tablet view" },
        { mode: "mobile", icon: Smartphone, label: "Mobile", title: "Mobile view" },
    ];

export function DemoToolbar({
    project,
    slugPath,
    demoSrc,
    viewport,
    onViewport,
    onRefresh,
}: Props) {
    const [spinning, setSpinning] = useState(false);

    function handleRefresh() {
        setSpinning(true);
        onRefresh();
        setTimeout(() => setSpinning(false), 800);
    }

    return (
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b border-border-light dark:border-border-dark bg-white dark:bg-card-dark shrink-0 flex-wrap sm:flex-nowrap">

            {/* Back */}
            <Link
                href="/projects"
                className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            >
                <ArrowLeft size={15} />
                <span className="hidden sm:inline">Projects</span>
            </Link>

            <span className="text-slate-300 dark:text-slate-600 hidden sm:block">/</span>

            {/* Project info */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
                <ProjectTypeBadge type={project.type} size="sm" />
                <h1 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                    {project.title}
                </h1>
                {project.day && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 hidden md:block">
                        {project.day}
                    </span>
                )}
            </div>

            {/* Viewport switcher — hidden on small screens */}
            <div className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                {VIEWPORT_BUTTONS.map(({ mode, icon: Icon, label, title }) => (
                    <button
                        key={mode}
                        onClick={() => onViewport(mode)}
                        title={title}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${viewport === mode
                                ? "bg-brand-500 text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            }`}
                    >
                        <Icon size={13} />
                        <span className="hidden lg:inline">{label}</span>
                    </button>
                ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
                {/* Refresh */}
                <button
                    onClick={handleRefresh}
                    title="Refresh demo"
                    className="w-8 h-8 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/40 transition-all duration-200"
                >
                    <RefreshCw
                        size={13}
                        className={spinning ? "animate-spin" : ""}
                    />
                </button>

                {/* Open in new tab */}
                <a
                    href={demoSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in new tab"
                    className="w-8 h-8 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/40 transition-all duration-200"
                >
                    <ExternalLink size={13} />
                </a>

                {/* View code */}
                <Link
                    href={`/code/${slugPath}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/40 text-xs font-semibold transition-all duration-200"
                >
                    <Code2 size={13} />
                    <span className="hidden sm:inline">Code</span>
                </Link>
            </div>
        </div>
    );
}