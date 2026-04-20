"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";
import { getFileIcon } from "@/components/code-viewer/fileIcons";
import type { FileNode } from "@/lib/types";

interface Props {
    node: FileNode;
    depth: number;
    selectedPath: string | null;
    onSelectFile: (path: string, ext: string | undefined) => void;
}

export function FileTreeNode({
    node,
    depth,
    selectedPath,
    onSelectFile,
}: Props) {
    const [open, setOpen] = useState(depth === 0); // root level open by default

    const isDir = node.type === "directory";
    const isSelected = !isDir && selectedPath === node.path;
    const iconInfo = getFileIcon(node.ext, isDir);
    const indent = depth * 12; // px indent per level

    if (isDir) {
        return (
            <div>
                {/* Folder row */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full flex items-center gap-1.5 py-1 px-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                    style={{ paddingLeft: `${8 + indent}px` }}
                >
                    {/* Expand arrow */}
                    <span className="text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-150">
                        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                    </span>

                    {/* Folder icon */}
                    <span className="text-brand-400 shrink-0">
                        {open ? <FolderOpen size={14} /> : <Folder size={14} />}
                    </span>

                    {/* Name */}
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white truncate font-medium">
                        {node.name}
                    </span>
                </button>

                {/* Children */}
                {open && node.children && node.children.length > 0 && (
                    <div>
                        {node.children.map((child) => (
                            <FileTreeNode
                                key={child.path}
                                node={child}
                                depth={depth + 1}
                                selectedPath={selectedPath}
                                onSelectFile={onSelectFile}
                            />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // File row
    return (
        <button
            onClick={() => onSelectFile(node.path, node.ext)}
            className={`w-full flex items-center gap-2 py-1 px-2 rounded-lg text-left transition-all duration-150 group ${isSelected
                    ? "bg-brand-500/15 border border-brand-500/30"
                    : "hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent"
                }`}
            style={{ paddingLeft: `${8 + indent}px` }}
        >
            {/* Spacer for alignment with folders */}
            <span className="w-3 shrink-0" />

            {/* Colored dot as file type indicator */}
            <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${iconInfo.bg} opacity-80`}
            />

            {/* Name */}
            <span
                className={`text-sm truncate font-mono ${isSelected
                        ? "text-brand-500 dark:text-brand-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white"
                    }`}
            >
                {node.name}
            </span>

            {/* Extension badge on hover / selected */}
            {node.ext && (
                <span
                    className={`ml-auto text-xs px-1.5 py-0.5 rounded font-mono shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? "opacity-100" : ""
                        } ${iconInfo.color} bg-slate-100 dark:bg-white/5`}
                >
                    {node.ext}
                </span>
            )}
        </button>
    );
}