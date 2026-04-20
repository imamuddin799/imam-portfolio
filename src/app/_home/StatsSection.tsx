"use client";

import { useEffect, useRef, useState } from "react";
import { FolderGit2, Code2, Calendar, GraduationCap } from "lucide-react";

interface StatItem {
    icon: React.ElementType;
    value: number;
    suffix: string;
    label: string;
    color: string;
}

const STATS: StatItem[] = [
    {
        icon: FolderGit2,
        value: 50,
        suffix: "+",
        label: "Projects Built",
        color: "text-brand-500",
    },
    {
        icon: Code2,
        value: 12,
        suffix: "+",
        label: "Technologies",
        color: "text-emerald-500",
    },
    {
        icon: Calendar,
        value: 30,
        suffix: "+",
        label: "Days of Learning",
        color: "text-violet-500",
    },
    {
        icon: GraduationCap,
        value: 2024,
        suffix: "",
        label: "Graduated",
        color: "text-amber-500",
    },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) setStarted(true);
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [started]);

    useEffect(() => {
        if (!started) return;
        const duration = 1500;
        const steps = 60;
        const increment = value / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [started, value]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

export function StatsSection() {
    return (
        <section className="py-16 border-y border-border-light dark:border-border-dark bg-white dark:bg-card-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {STATS.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark hover:border-brand-500/30 hover:shadow-card-md transition-all duration-300 group"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <p className={`font-display text-3xl sm:text-4xl font-bold ${stat.color}`}>
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}