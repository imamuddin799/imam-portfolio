"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { PROJECT_CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import type { ProjectCategory, SortOption } from "@/lib/types";

interface Props {
    search: string;
    category: ProjectCategory;
    sort: SortOption;
    onSearch: (v: string) => void;
    onCategory: (v: ProjectCategory) => void;
    onSort: (v: SortOption) => void;
    resultCount: number;
}

export function ProjectFilters({
    search,
    category,
    sort,
    onSearch,
    onCategory,
    onSort,
    resultCount,
}: Props) {
    const hasFilters = search !== "" || category !== "All" || sort !== "newest";

    function clearAll() {
        onSearch("");
        onCategory("All");
        onSort("newest");
    }

    return (
        <div className="flex flex-col gap-4 mb-8">

            {/* Row 1 — Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3">

                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search projects..."
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
                    />
                    {search && (
                        <button
                            onClick={() => onSearch("")}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2 shrink-0">
                    <SlidersHorizontal size={15} className="text-slate-400 shrink-0" />
                    <select
                        value={sort}
                        onChange={(e) => onSort(e.target.value as SortOption)}
                        className="pl-3 pr-8 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 cursor-pointer appearance-none"
                        style={{ backgroundImage: "none" }}
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Row 2 — Category pills */}
            <div className="flex flex-wrap gap-2">
                {PROJECT_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategory(cat as ProjectCategory)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${category === cat
                                ? "bg-brand-500 text-white border-brand-500 shadow-glow"
                                : "border-border-light dark:border-border-dark text-slate-600 dark:text-slate-400 hover:border-brand-500/50 hover:text-brand-500 dark:hover:text-brand-400 bg-white dark:bg-card-dark"
                            }`}
                    >
                        {cat}
                    </button>
                ))}

                {/* Clear filters */}
                {hasFilters && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border border-rose-500/30 text-rose-500 dark:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 ml-auto"
                    >
                        <X size={13} />
                        Clear
                    </button>
                )}
            </div>

            {/* Row 3 — Result count */}
            {(search || category !== "All") && (
                <p className="text-sm text-slate-500 dark:text-slate-400 animate-fade-in">
                    Found{" "}
                    <span className="text-brand-500 font-semibold">{resultCount}</span>{" "}
                    project{resultCount !== 1 ? "s" : ""}
                    {search && (
                        <>
                            {" "}matching{" "}
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                &ldquo;{search}&rdquo;
                            </span>
                        </>
                    )}
                    {category !== "All" && (
                        <>
                            {" "}in{" "}
                            <span className="text-slate-700 dark:text-slate-300 font-medium">
                                {category}
                            </span>
                        </>
                    )}
                </p>
            )}
        </div>
    );
}