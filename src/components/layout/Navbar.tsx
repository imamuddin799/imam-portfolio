"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Moon, Sun, Menu, X, Code2 } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { GithubIcon } from "@/components/icons/SocialIcons";
import { PERSONAL_INFO } from "@/lib/constants";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Skills", href: "/#skills" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
];

export function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border-dark bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md transition-colors duration-300">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 font-display font-bold text-xl text-slate-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                >
                    <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                        <Code2 size={18} className="text-white" />
                    </span>
                    <span>Imam<span className="text-brand-500">.</span>dev</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                        ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                    <a
                        href={PERSONAL_INFO.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                        className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
                    >
                        <GithubIcon size={17} />
                    </a>

                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle menu"
                        className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200"
                    >
                        {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-border-light dark:border-border-dark bg-white dark:bg-surface-dark animate-fade-in">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                            ? "bg-brand-500/10 text-brand-600 dark:text-brand-400"
                                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </header>
    );
}