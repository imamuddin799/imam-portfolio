"use client";

import { useState } from "react";
import { SKILLS, SKILL_CATEGORIES, TECH_COLORS } from "@/lib/constants";
import type { SkillCategory } from "@/lib/types";

export function SkillsSection() {
    const [active, setActive] = useState<SkillCategory>("All");

    const filtered =
        active === "All"
            ? SKILLS
            : SKILLS.filter((s) => s.category === active);

    return (
        <section id="skills" className="py-20 bg-surface-light dark:bg-surface-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-3">
                        What I work with
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                        Skills & Technologies
                    </h2>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {SKILL_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActive(cat as SkillCategory)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${active === cat
                                    ? "bg-brand-500 text-white border-brand-500 shadow-glow"
                                    : "border-border-light dark:border-border-dark text-slate-600 dark:text-slate-400 hover:border-brand-500/50 hover:text-brand-500 dark:hover:text-brand-400 bg-white dark:bg-card-dark"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((skill) => {
                        const colorClass =
                            TECH_COLORS[skill.name] ?? TECH_COLORS["default"];
                        return (
                            <div
                                key={skill.name}
                                className="p-5 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark hover:border-brand-500/30 hover:shadow-card-md transition-all duration-300 group animate-fade-in"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold border ${colorClass}`}
                                        >
                                            {skill.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {skill.level}%
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-brand-500 transition-all duration-1000 ease-out group-hover:bg-brand-400"
                                        style={{ width: `${skill.level}%` }}
                                    />
                                </div>

                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 capitalize">
                                    {skill.category}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}