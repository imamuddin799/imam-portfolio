"use client";

import { useState } from "react";
import { Search, X, FolderGit2 } from "lucide-react";
import { FileTreeNode } from "@/components/code-viewer/FileTreeNode";
import type { FileNode } from "@/lib/types";

interface Props {
    projectTitle: string;
    fileTree: FileNode[];
    selectedPath: string | null;
    onSelectFile: (path: string, ext: string | undefined) => void;
}

function filterTree(nodes: FileNode[], query: string): FileNode[] {
    if (!query) return nodes;
    const q = query.toLowerCase();
    return nodes.reduce<FileNode[]>((acc, node) => {
        if (node.type === "directory" && node.children) {
            const filteredChildren = filterTree(node.children, q);
            if (filteredChildren.length > 0) {
                acc.push({ ...node, children: filteredChildren });
            }
        } else if (node.name.toLowerCase().includes(q)) {
            acc.push(node);
        }
        return acc;
    }, []);
}

export function FileTree({
    projectTitle,
    fileTree,
    selectedPath,
    onSelectFile,
}: Props) {
    const [search, setSearch] = useState("");

    const displayTree = filterTree(fileTree, search);

    return (
        <aside className="flex flex-col h-full bg-white dark:bg-card-dark border-r border-border-light dark:border-border-dark">

            {/* Header */}
            <div className="px-3 py-3 border-b border-border-light dark:border-border-dark shrink-0">
                <div className="flex items-center gap-2 mb-3">
                    <FolderGit2 size={15} className="text-brand-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">
                        {projectTitle}
                    </span>
                </div>

                {/* Search within files */}
                <div className="relative">
                    <Search
                        size={12}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Find file..."
                        className="w-full pl-7 pr-7 py-1.5 text-xs rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:border-brand-500/50 transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                            <X size={11} />
                        </button>
                    )}
                </div>
            </div>

            {/* Tree */}
            <div className="flex-1 overflow-y-auto py-2 px-1">
                {displayTree.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8 px-3">
                        No files match &ldquo;{search}&rdquo;
                    </p>
                ) : (
                    displayTree.map((node) => (
                        <FileTreeNode
                            key={node.path}
                            node={node}
                            depth={0}
                            selectedPath={selectedPath}
                            onSelectFile={onSelectFile}
                        />
                    ))
                )}
            </div>

            {/* Footer — file count */}
            <div className="px-3 py-2 border-t border-border-light dark:border-border-dark shrink-0">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                    {fileTree.length} item{fileTree.length !== 1 ? "s" : ""} in root
                </p>
            </div>
        </aside>
    );
}