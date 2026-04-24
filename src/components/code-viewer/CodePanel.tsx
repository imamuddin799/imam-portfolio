"use client";

import { useEffect, useRef, useState } from "react";
import { CodeToolbar } from "@/components/code-viewer/CodeToolbar";
import { useTheme } from "@/components/providers/ThemeProvider";
import { FileText, MousePointerClick } from "lucide-react";
import { markdownToHtml } from "@/lib/markdownToHtml";

interface Props {
    filePath: string | null;
    ext: string | undefined;
    content: string | null;
    highlightedDark: string | null;
    highlightedLight: string | null;
    loading: boolean;
    slugPath: string;
}

const IMAGE_EXTS = ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "bmp", "tiff"];
const PDF_EXTS = ["pdf"];

const SKELETON_WIDTHS = [75, 50, 90, 60, 80, 45, 70, 55, 85, 40, 65, 78];

// Light theme: clean white background, dark text — GitHub Light palette
const LIGHT_CODE_BG = "#ffffff";
const LIGHT_CODE_FG = "#24292e";

// Dark theme: deep background — GitHub Dark palette
const DARK_CODE_BG = "#0d1117";
const DARK_CODE_FG = "#e6edf3";

export function CodePanel({
    filePath,
    ext,
    content,
    highlightedDark,
    highlightedLight,
    loading,
    slugPath,
}: Props) {
    const { theme } = useTheme();
    const [wordWrap, setWordWrap] = useState(false);
    const [showPreview, setShowPreview] = useState(false);  // ← new state for toggling markdown preview
    const scrollRef = useRef<HTMLDivElement>(null);

    const isDark = theme === "dark";

    const mdProse = isDark
        ? {
            "--md-text": "#e6edf3",
            "--md-muted": "#8b949e",
            "--md-border": "#1e293b",
            "--md-code-bg": "#161b22",
            "--md-heading": "#e6edf3",
            "--md-link": "#58a6ff",
            "--md-blockquote": "#8b949e",
            "--md-hr": "#21262d",
            "--md-bg": "#0d1117",
        }
        : {
            "--md-text": "#24292f",
            "--md-muted": "#57606a",
            "--md-border": "#d0d7de",
            "--md-code-bg": "#f6f8fa",
            "--md-heading": "#1f2328",
            "--md-link": "#0969da",
            "--md-blockquote": "#57606a",
            "--md-hr": "#d0d7de",
            "--md-bg": "#ffffff",
        };
    const highlighted = isDark ? highlightedDark : highlightedLight;
    const codeBg = isDark ? DARK_CODE_BG : LIGHT_CODE_BG;
    const codeFg = isDark ? DARK_CODE_FG : LIGHT_CODE_FG;
    const lineNumBg = isDark ? "#0a0f1a" : "#f6f8fa";
    const lineNumFg = isDark ? "#4b5563" : "#9ea7b4";
    const borderCol = isDark ? "#1e293b" : "#e2e8f0";

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: 0, left: 0 });
    }, [filePath]);

    const lineCount = content ? content.split("\n").length : 0;
    const isImage = ext && IMAGE_EXTS.includes(ext.toLowerCase());
    const isPdf = ext && PDF_EXTS.includes(ext.toLowerCase());

    const previewUrl = filePath
        ? `/api/project-file?slug=${encodeURIComponent(slugPath)}&file=${encodeURIComponent(filePath)}`
        : "";

    // ── No file selected ──────────────────────────────────────────────────────
    if (!filePath) {
        return (
            <div
                className="flex flex-col items-center justify-center h-full gap-4 text-center p-8"
                style={{ background: codeBg }}
            >
                <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark flex items-center justify-center">
                    <MousePointerClick size={24} className="text-slate-300 dark:text-slate-600" />
                </div>
                <div>
                    <p className="font-semibold text-slate-500 dark:text-slate-400">
                        Select a file to view its content
                    </p>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Click any file in the explorer on the left
                    </p>
                </div>
            </div>
        );
    }

    // ── Loading skeleton ──────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex flex-col h-full" style={{ background: codeBg }}>
                <div
                    className="px-4 py-2.5 border-b"
                    style={{ borderColor: borderCol }}
                >
                    <div className="h-4 w-48 rounded animate-pulse"
                        style={{ background: isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0" }}
                    />
                </div>
                <div className="flex-1 p-6 flex flex-col gap-3">
                    {SKELETON_WIDTHS.map((w, i) => (
                        <div
                            key={i}
                            className="h-4 rounded animate-pulse"
                            style={{
                                width: `${w}%`,
                                background: isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
                            }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // ── Image preview ─────────────────────────────────────────────────────────
    if (isImage) {
        return (
            <div className="flex flex-col h-full" style={{ background: codeBg }}>
                <CodeToolbar
                    filePath={filePath}
                    ext={ext}
                    content=""
                    lineCount={0}
                    wordWrap={wordWrap}
                    onToggleWrap={() => setWordWrap((v) => !v)}
                    showPreview={false}
                    onTogglePreview={() => { }}
                />
                <div
                    className="flex-1 overflow-auto flex items-center justify-center p-6"
                    style={{
                        // Checkerboard to show transparency
                        backgroundImage:
                            `linear-gradient(45deg, ${isDark ? "#1e293b" : "#e2e8f0"} 25%, transparent 25%),` +
                            `linear-gradient(-45deg, ${isDark ? "#1e293b" : "#e2e8f0"} 25%, transparent 25%),` +
                            `linear-gradient(45deg, transparent 75%, ${isDark ? "#1e293b" : "#e2e8f0"} 75%),` +
                            `linear-gradient(-45deg, transparent 75%, ${isDark ? "#1e293b" : "#e2e8f0"} 75%)`,
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                        backgroundColor: isDark ? "#0a0f1a" : "#f8fafc",
                    }}
                >
                    <div className="rounded-xl overflow-hidden shadow-2xl max-w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={previewUrl}
                            alt={filePath}
                            className="max-w-full max-h-[calc(100vh-220px)] object-contain block"
                        />
                    </div>
                </div>
                <div
                    className="flex items-center justify-between px-4 py-2 border-t text-xs"
                    style={{ borderColor: borderCol, background: codeBg, color: codeFg }}
                >
                    <span className="font-mono truncate opacity-60">{filePath}</span>
                    <a href={previewUrl} download className="text-brand-500 hover:text-brand-400 font-medium shrink-0 ml-3">
                        Download
                    </a>
                </div>
            </div>
        );
    }

    // ── PDF preview ───────────────────────────────────────────────────────────
    if (isPdf) {
        return (
            <div className="flex flex-col h-full" style={{ background: codeBg }}>
                <CodeToolbar
                    filePath={filePath}
                    ext={ext}
                    content=""
                    lineCount={0}
                    wordWrap={wordWrap}
                    onToggleWrap={() => setWordWrap((v) => !v)}
                    showPreview={false}
                    onTogglePreview={() => { }}
                />
                <div className="flex-1 overflow-hidden">
                    <embed
                        src={previewUrl}
                        type="application/pdf"
                        className="w-full h-full"
                        style={{ minHeight: "500px" }}
                    />
                </div>
                <div
                    className="flex items-center justify-between px-4 py-2 border-t text-xs"
                    style={{ borderColor: borderCol, background: codeBg }}
                >
                    <div className="flex items-center gap-2 opacity-60" style={{ color: codeFg }}>
                        <FileText size={13} />
                        <span className="font-mono truncate">{filePath}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                        <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:text-brand-400 font-medium">
                            Open in new tab
                        </a>
                        <a href={previewUrl} download className="text-brand-500 hover:text-brand-400 font-medium">
                            Download
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // ── Binary / unreadable ───────────────────────────────────────────────────
    if (content === null) {
        return (
            <div className="flex flex-col h-full" style={{ background: codeBg }}>
                <CodeToolbar
                    filePath={filePath} ext={ext} content="" lineCount={0}
                    wordWrap={wordWrap} onToggleWrap={() => setWordWrap((v) => !v)}
                    showPreview={false} onTogglePreview={() => { }}
                />
                <div className="flex-1 flex items-center justify-center" style={{ color: codeFg }}>
                    <p className="text-sm opacity-50">Cannot preview this file type</p>
                </div>
            </div>
        );
    }

    // ── Code display ──────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full" style={{ background: codeBg }}>
            <CodeToolbar
                filePath={filePath}
                ext={ext}
                content={content}
                lineCount={lineCount}
                wordWrap={wordWrap}
                onToggleWrap={() => setWordWrap((v) => !v)}
                showPreview={showPreview}              // ← new
                onTogglePreview={() => setShowPreview((v) => !v)}  // ← new
            />

            <div ref={scrollRef} className="flex-1 overflow-auto">

                {/* ── Markdown preview ── */}
                {showPreview && ext === "md" ? (
                    <div
                        className="md-preview px-10 py-8 max-w-4xl mx-auto"
                        style={{ ...mdProse, background: mdProse["--md-bg"] } as React.CSSProperties}
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
                    />
                ) : highlighted ? (
                    /* Shiki highlighted */
                    <div
                        className={`min-h-full text-sm leading-relaxed [&>pre]:!bg-transparent [&>pre]:p-6 [&>pre]:min-h-full
                        ${wordWrap
                                ? "[&>pre]:whitespace-pre-wrap [&>pre]:break-all"
                                : "[&>pre]:whitespace-pre"
                            }`}
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                    />
                ) : (
                    /* Fallback plain text with line numbers */
                    <div className="flex min-h-full">
                        <div
                            className="select-none text-right pr-4 py-6 pl-4 text-xs font-mono border-r shrink-0"
                            style={{
                                background: lineNumBg,
                                color: lineNumFg,
                                borderColor: borderCol,
                                lineHeight: "1.5rem",
                            }}
                            aria-hidden="true"
                        >
                            {content.split("\n").map((_, i) => (
                                <div key={i} style={{ lineHeight: "1.5rem" }}>{i + 1}</div>
                            ))}
                        </div>
                        <pre
                            className={`flex-1 p-6 text-xs font-mono leading-6 ${wordWrap
                                ? "whitespace-pre-wrap break-all overflow-x-hidden"
                                : "whitespace-pre overflow-x-auto"
                                }`}
                            style={{ color: codeFg, background: codeBg }}
                        >
                            {content}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}