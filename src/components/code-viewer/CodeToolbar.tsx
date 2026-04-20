"use client";

import { useState } from "react";
import { Copy, Check, ChevronRight, WrapText } from "lucide-react";
import { getFileIcon } from "@/components/code-viewer/fileIcons";
import { useTheme } from "@/components/providers/ThemeProvider";

interface Props {
    filePath: string | null;
    ext: string | undefined;
    content: string;
    lineCount: number;
    wordWrap: boolean;
    onToggleWrap: () => void;
}

export function CodeToolbar({
    filePath,
    ext,
    content,
    lineCount,
    wordWrap,
    onToggleWrap,
}: Props) {
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const bg = isDark ? "#0d1117" : "#f6f8fa";
    const border = isDark ? "#1e293b" : "#e2e8f0";
    const textMuted = isDark ? "#6b7280" : "#6b7280";
    const textNormal = isDark ? "#9ca3af" : "#4b5563";

    async function handleCopy() {
        if (!content) return;
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    if (!filePath) return null;

    const parts = filePath.split(/[\\/]/);
    const iconInfo = getFileIcon(ext, false);

    return (
        <div
            className="flex items-center justify-between px-4 py-2 shrink-0 border-b"
            style={{ background: bg, borderColor: border }}
        >
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 min-w-0 overflow-hidden flex-1">
                {parts.map((part, i) => {
                    const isLast = i === parts.length - 1;
                    return (
                        <span key={i} className="flex items-center gap-1 shrink-0">
                            {i > 0 && (
                                <ChevronRight size={12} style={{ color: textMuted }} />
                            )}
                            <span
                                className={`text-xs font-mono truncate ${isLast ? `font-semibold ${iconInfo.color}` : ""}`}
                                style={!isLast ? { color: textMuted } : {}}
                            >
                                {part}
                            </span>
                        </span>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5 shrink-0 ml-3">

                {/* Line count */}
                <span className="text-xs hidden sm:block" style={{ color: textMuted }}>
                    {lineCount} line{lineCount !== 1 ? "s" : ""}
                </span>

                {/* Word wrap toggle */}
                <button
                    onClick={onToggleWrap}
                    title={wordWrap ? "Disable word wrap" : "Enable word wrap"}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
                    style={{
                        background: wordWrap ? "rgba(14,165,233,0.1)" : "transparent",
                        borderColor: wordWrap ? "rgba(14,165,233,0.4)" : border,
                        color: wordWrap ? "#0ea5e9" : textNormal,
                    }}
                >
                    <WrapText size={12} />
                    <span className="hidden sm:inline">Wrap</span>
                </button>

                {/* Copy button */}
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
                    style={{
                        background: copied ? "rgba(16,185,129,0.1)" : "transparent",
                        borderColor: copied ? "rgba(16,185,129,0.3)" : border,
                        color: copied ? "#10b981" : textNormal,
                    }}
                >
                    {copied
                        ? <><Check size={12} /> Copied</>
                        : <><Copy size={12} />  Copy</>
                    }
                </button>
            </div>
        </div>
    );
}