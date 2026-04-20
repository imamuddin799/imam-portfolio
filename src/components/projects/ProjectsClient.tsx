"use client";

import { useState, useMemo } from "react";
import { LayoutGrid, List, Layers } from "lucide-react";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectsStats } from "@/components/projects/ProjectsStats";
import type { Project, ProjectCategory, SortOption } from "@/lib/types";

type ViewMode = "grid" | "list" | "grouped";

interface Props {
    projects: Project[];
}

function sortProjects(projects: Project[], sort: SortOption): Project[] {
    return [...projects].sort((a, b) => {
        switch (sort) {
            case "newest":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "az":
                return a.title.localeCompare(b.title);
            case "za":
                return b.title.localeCompare(a.title);
            case "day":
                return (a.day ?? "zzz").localeCompare(b.day ?? "zzz");
            default:
                return 0;
        }
    });
}

function filterProjects(
    projects: Project[],
    search: string,
    category: ProjectCategory
): Project[] {
    return projects.filter((p) => {
        const matchSearch =
            search === "" ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
            (p.day ?? "").toLowerCase().includes(search.toLowerCase());

        const matchCategory =
            category === "All" ||
            (category === "React" && p.type === "react") ||
            (category === "HTML/CSS/JS" && p.type === "html-js") ||
            (category === "Java" && p.type === "java") ||
            (category === "Spring Boot" && p.type === "springboot") ||
            (category === "SQL" && p.type === "sql");

        return matchSearch && matchCategory;
    });
}

export function ProjectsClient({ projects }: Props) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<ProjectCategory>("All");
    const [sort, setSort] = useState<SortOption>("newest");
    const [view, setView] = useState<ViewMode>("grid");

    const filtered = useMemo(
        () => filterProjects(projects, search, category),
        [projects, search, category]
    );

    const sorted = useMemo(() => sortProjects(filtered, sort), [filtered, sort]);

    // Group by day for "grouped" view
    const grouped = useMemo(() => {
        const map = new Map<string, Project[]>();
        for (const p of sorted) {
            const key = p.day ?? "Other / Tasks";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(p);
        }
        return map;
    }, [sorted]);

    const VIEW_BUTTONS: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
        { mode: "grid", icon: LayoutGrid, label: "Grid" },
        { mode: "list", icon: List, label: "List" },
        { mode: "grouped", icon: Layers, label: "By Day" },
    ];

    return (
        <div>
            {/* Stats */}
            <ProjectsStats
                projects={projects}
                filtered={filtered.length}
                total={projects.length}
            />

            {/* Filters */}
            <ProjectFilters
                search={search}
                category={category}
                sort={sort}
                onSearch={setSearch}
                onCategory={setCategory}
                onSort={setSort}
                resultCount={filtered.length}
            />

            {/* View toggle */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {sorted.length}
                    </span>{" "}
                    result{sorted.length !== 1 ? "s" : ""}
                </p>

                <div className="flex items-center gap-1 p-1 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark">
                    {VIEW_BUTTONS.map(({ mode, icon: Icon, label }) => (
                        <button
                            key={mode}
                            onClick={() => setView(mode)}
                            title={label}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${view === mode
                                    ? "bg-brand-500 text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            <Icon size={13} />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Empty state */}
            {sorted.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border-light dark:border-border-dark flex items-center justify-center text-slate-300 dark:text-slate-600">
                        <LayoutGrid size={24} />
                    </div>
                    <div className="text-center">
                        <p className="font-semibold text-slate-700 dark:text-slate-300">No projects found</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                            Try adjusting your search or filters
                        </p>
                    </div>
                </div>
            )}

            {/* Grid View */}
            {view === "grid" && sorted.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
                    {sorted.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            {/* List View */}
            {view === "list" && sorted.length > 0 && (
                <div className="flex flex-col gap-3 animate-fade-in">
                    {sorted.map((project) => (
                        <div
                            key={project.id}
                            className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 p-4 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark hover:border-brand-500/30 hover:shadow-card-md transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div
                                    className={`w-2 h-10 rounded-full shrink-0 ${project.type === "react" ? "bg-cyan-500" :
                                            project.type === "html-js" ? "bg-orange-500" :
                                                project.type === "java" ? "bg-red-500" :
                                                    project.type === "springboot" ? "bg-green-500" :
                                                        project.type === "sql" ? "bg-amber-500" :
                                                            "bg-slate-400"
                                        }`}
                                />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                            {project.title}
                                        </h3>
                                        {project.day && (
                                            <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                                                {project.day}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {project.tags.slice(0, 4).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-1.5 py-0.5 rounded text-xs bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {project.hasLiveDemo && (
                                    <a
                                        href={`/demo/${project.slug.join("/")}`}
                                        className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold transition-colors"
                                    >
                                        Demo
                                    </a>
                                )}
                                <a
                                    href={`/code/${project.slug.join("/")}`}
                                    className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:border-brand-500/50 text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 text-xs font-semibold transition-all duration-200"
                                >
                                    Code
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Grouped by Day View */}
            {view === "grouped" && sorted.length > 0 && (
                <div className="flex flex-col gap-10 animate-fade-in">
                    {[...grouped.entries()].map(([day, dayProjects]) => (
                        <div key={day}>
                            {/* Day header */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20">
                                    <span className="w-2 h-2 rounded-full bg-brand-500" />
                                    <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                                        {day}
                                    </span>
                                </div>
                                <div className="h-px flex-1 bg-border-light dark:bg-border-dark" />
                                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
                                    {dayProjects.length} project{dayProjects.length !== 1 ? "s" : ""}
                                </span>
                            </div>

                            {/* Projects in this day */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {dayProjects.map((project) => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}