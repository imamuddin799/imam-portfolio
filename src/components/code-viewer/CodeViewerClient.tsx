"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, PanelLeft, X } from "lucide-react";
import { FileTree } from "@/components/code-viewer/FileTree";
import { CodePanel } from "@/components/code-viewer/CodePanel";
import { ProjectTypeBadge } from "@/components/projects/ProjectTypeBadge";
import type { Project } from "@/lib/types";

interface Props {
    project: Project;
    slugPath: string;
}

const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "bmp", "tiff"];
const PDF_EXTS = ["pdf"];

export function CodeViewerClient({ project, slugPath }: Props) {
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [selectedExt, setSelectedExt] = useState<string | undefined>(undefined);
    const [content, setContent] = useState<string | null>(null);
    const [highlightedDark, setHighlightedDark] = useState<string | null>(null);
    const [highlightedLight, setHighlightedLight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleSelectFile = useCallback(async (path: string, ext: string | undefined) => {
        if (path === selectedPath) return;

        setSelectedPath(path);
        setSelectedExt(ext);
        setContent(null);
        setHighlightedDark(null);
        setHighlightedLight(null);

        // Images and PDFs — handled directly via URL in CodePanel, no fetch needed
        const isImage = ext && IMAGE_EXTS.includes(ext.toLowerCase());
        const isPdf = ext && PDF_EXTS.includes(ext.toLowerCase());

        if (isImage || isPdf) {
            setLoading(false);
            if (window.innerWidth < 768) setSidebarOpen(false);
            return;
        }

        setLoading(true);
        if (window.innerWidth < 768) setSidebarOpen(false);

        try {
            const res = await fetch(
                `/api/file-content?slug=${encodeURIComponent(slugPath)}&file=${encodeURIComponent(path)}`
            );
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setContent(data.content ?? null);
            setHighlightedDark(data.highlightedDark ?? null);
            setHighlightedLight(data.highlightedLight ?? null);
        } catch {
            setContent(null);
            setHighlightedDark(null);
            setHighlightedLight(null);
        } finally {
            setLoading(false);
        }
    }, [selectedPath, slugPath]);

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-surface-light dark:bg-surface-dark">

            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border-light dark:border-border-dark bg-white dark:bg-card-dark shrink-0">
                <Link
                    href="/projects"
                    className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
                >
                    <ArrowLeft size={15} />
                    <span className="hidden sm:inline">Projects</span>
                </Link>

                <span className="text-slate-300 dark:text-slate-600">/</span>

                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <ProjectTypeBadge type={project.type} size="sm" />
                    <h1 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                        {project.title}
                    </h1>
                    {project.day && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block">
                            {project.day}
                        </span>
                    )}
                </div>

                {project.hasLiveDemo && (
                    <Link
                        href={`/demo/${slugPath}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors shrink-0"
                    >
                        <Play size={12} />
                        <span className="hidden sm:inline">Live Demo</span>
                    </Link>
                )}

                <button
                    onClick={() => setSidebarOpen((v) => !v)}
                    className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-border-light dark:border-border-dark text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    {sidebarOpen ? <X size={15} /> : <PanelLeft size={15} />}
                </button>
            </div>

            {/* Main layout */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* File Tree sidebar */}
                <div
                    className={`shrink-0 overflow-hidden transition-all duration-300
            ${sidebarOpen ? "w-64" : "w-0"}
            md:w-64 absolute md:relative z-10 h-full`}
                >
                    <div className="w-64 h-full">
                        <FileTree
                            projectTitle={project.title}
                            fileTree={project.fileTree}
                            selectedPath={selectedPath}
                            onSelectFile={handleSelectFile}
                        />
                    </div>
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div
                        className="md:hidden absolute inset-0 bg-black/40 z-[9]"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Code / Preview Panel */}
                <div className="flex-1 overflow-hidden">
                    <CodePanel
                        filePath={selectedPath}
                        ext={selectedExt}
                        content={content}
                        highlightedDark={highlightedDark}
                        highlightedLight={highlightedLight}
                        loading={loading}
                        slugPath={slugPath}
                    />
                </div>
            </div>
        </div>
    );
}