"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Download, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { useTheme } from "@/components/providers/ThemeProvider";
import { PERSONAL_INFO } from "@/lib/constants";

const ROTATING_TITLES = [
    "Full Stack Developer",
    "React.js Enthusiast",
    "Next.js Developer",
    "Java Developer",
    "Spring Boot Developer",
];

export function HeroSection() {
    const [titleIndex, setTitleIndex] = useState(0);
    const [displayed, setDisplayed] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Typewriter effect
    useEffect(() => {
        const current = ROTATING_TITLES[titleIndex];

        if (!deleting && charIndex < current.length) {
            const t = setTimeout(() => {
                setDisplayed(current.slice(0, charIndex + 1));
                setCharIndex((i) => i + 1);
            }, 80);
            return () => clearTimeout(t);
        }

        if (!deleting && charIndex === current.length) {
            const t = setTimeout(() => setDeleting(true), 1800);
            return () => clearTimeout(t);
        }

        if (deleting && charIndex > 0) {
            const t = setTimeout(() => {
                setDisplayed(current.slice(0, charIndex - 1));
                setCharIndex((i) => i - 1);
            }, 40);
            return () => clearTimeout(t);
        }

        if (deleting && charIndex === 0) {
            setDeleting(false);
            setTitleIndex((i) => (i + 1) % ROTATING_TITLES.length);
        }
    }, [charIndex, deleting, titleIndex]);

    // Dot color: visible on both themes
    // Light: dark slate dots on white background
    // Dark:  subtle lighter dots on dark background
    const dotColor = isDark ? "#1e293b" : "#94a3b8";

    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white dark:bg-surface-dark">

            {/* Background dot grid — theme aware */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
                    backgroundSize: "28px 28px",
                    opacity: isDark ? 1 : 0.6,
                }}
            />

            {/* Glow blobs */}
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-brand-500/10 dark:bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-brand-400/10 dark:bg-brand-300/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left — Text */}
                    <div className="flex flex-col gap-6 animate-slide-up">

                        {/* Available badge */}
                        <div className="flex items-center gap-2 w-fit px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/5 text-brand-600 dark:text-brand-400 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-slow" />
                            Available for opportunities
                        </div>

                        {/* Name */}
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-1">
                                Hey, I&apos;m
                            </p>
                            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                                {PERSONAL_INFO.firstName}
                                <br />
                                <span className="text-brand-500">{PERSONAL_INFO.lastName}</span>
                            </h1>
                        </div>

                        {/* Typewriter */}
                        <div className="h-10 flex items-center">
                            <span className="font-display text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300">
                                {displayed}
                                <span className="inline-block w-0.5 h-6 bg-brand-500 ml-1 animate-pulse" />
                            </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                            <MapPin size={14} />
                            <span>{PERSONAL_INFO.location}</span>
                        </div>

                        {/* Bio */}
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                            {PERSONAL_INFO.bio}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3 pt-2">
                            <Link
                                href="/projects"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5"
                            >
                                View Projects
                                <ArrowRight size={16} />
                            </Link>
                            <a
                                href="/files/Imamuddin_resume.pdf"
                                download
                                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-card-dark hover:border-brand-500/50 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                            >
                                <Download size={16} />
                                Resume
                            </a>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href={PERSONAL_INFO.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-card-dark flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/50 transition-all duration-200 shadow-sm"
                            >
                                <GithubIcon size={18} />
                            </a>
                            <a
                                href={PERSONAL_INFO.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-xl border border-slate-200 dark:border-border-dark bg-white dark:bg-card-dark flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/50 transition-all duration-200 shadow-sm"
                            >
                                <LinkedinIcon size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Right — Avatar Card */}
                    <div className="flex justify-center lg:justify-end animate-fade-in">
                        <div className="relative">

                            {/* Main card */}
                            <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-3xl border-2 border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-brand-300/5 to-transparent dark:from-brand-500/10 dark:via-brand-300/5 flex items-center justify-center shadow-card-lg dark:shadow-card-dark">
                                <div className="font-display text-8xl sm:text-9xl font-bold text-brand-500/20 select-none">
                                    IA
                                </div>

                                {/* Tech stack badge */}
                                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl px-4 py-3 shadow-card-md">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Tech Stack</p>
                                    <div className="flex items-center gap-1.5">
                                        {["React", "Next.js", "Java"].map((t) => (
                                            <span
                                                key={t}
                                                className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-medium"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Education badge */}
                                <div className="absolute -top-4 -left-4 bg-white dark:bg-card-dark border border-slate-200 dark:border-border-dark rounded-2xl px-4 py-3 shadow-card-md max-w-[180px]">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Education</p>
                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                                        B.Tech CSE &apos;{PERSONAL_INFO.education.year.slice(2)}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug truncate">
                                        {PERSONAL_INFO.education.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll hint */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-300 dark:text-slate-600 animate-bounce">
                    <div className="w-5 h-8 rounded-full border-2 border-current flex items-start justify-center pt-1.5">
                        <div className="w-1 h-2 rounded-full bg-current" />
                    </div>
                </div>
            </div>
        </section>
    );
}