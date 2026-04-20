import { GraduationCap, MapPin, Briefcase, Heart } from "lucide-react";
import { PERSONAL_INFO, SKILLS } from "@/lib/constants";

export function AboutSection() {
    const frontendSkills = SKILLS.filter((s) => s.category === "Frontend");
    const backendSkills = SKILLS.filter((s) => s.category !== "Frontend");

    return (
        <section id="about" className="py-20 bg-white dark:bg-card-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-3">
                        Get to know me
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                        About Me
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left — Story */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">
                                My Journey
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                                {PERSONAL_INFO.bio}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Originally from <span className="text-brand-500 font-medium">{PERSONAL_INFO.hometown}</span>,
                                I moved to Hyderabad to pursue my engineering degree. During my studies,
                                I fell in love with web development and started building projects for every
                                concept I learned — which is how this portfolio was born.
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                                <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                                    <GraduationCap size={18} className="text-brand-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Education</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                        {PERSONAL_INFO.education.degree}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {PERSONAL_INFO.education.institute} · {PERSONAL_INFO.education.year}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <MapPin size={18} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Location</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {PERSONAL_INFO.location}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        From {PERSONAL_INFO.hometown}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                                    <Briefcase size={18} className="text-violet-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Role</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        {PERSONAL_INFO.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        {PERSONAL_INFO.titleTags.join(" · ")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark">
                                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                                    <Heart size={18} className="text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Interests</p>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                        Building products
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Open source · Learning daily
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Skills Grouped */}
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-6">
                                Tech I Use
                            </h3>

                            {/* Frontend */}
                            <div className="mb-6">
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest mb-3">
                                    Frontend
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {frontendSkills.map((s) => (
                                        <span
                                            key={s.name}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-700 dark:text-slate-300 hover:border-brand-500/40 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-default"
                                        >
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Backend / Other */}
                            <div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest mb-3">
                                    Backend & Tools
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {backendSkills.map((s) => (
                                        <span
                                            key={s.name}
                                            className="px-3 py-1.5 rounded-lg text-sm font-medium border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-700 dark:text-slate-300 hover:border-brand-500/40 hover:text-brand-500 dark:hover:text-brand-400 transition-colors cursor-default"
                                        >
                                            {s.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Learning approach */}
                        <div className="p-6 rounded-2xl border border-brand-500/20 bg-brand-500/5">
                            <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-2">
                                🚀 My Learning Philosophy
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                I believe in <span className="font-semibold text-slate-800 dark:text-slate-200">learning by building</span>.
                                Every concept I study — whether it&apos;s React hooks, Java OOP, or Spring Boot REST APIs —
                                I immediately convert into a real working project. This portfolio is proof of that approach.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}