"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    toggleTheme: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    // On mount: read localStorage or fall back to system preference
    useEffect(() => {
        const stored = localStorage.getItem("devfolio-theme") as Theme | null;

        if (stored === "light" || stored === "dark") {
            setTheme(stored);
            applyTheme(stored);
        } else {
            // No stored preference — use system setting
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const systemTheme: Theme = prefersDark ? "dark" : "light";
            setTheme(systemTheme);
            applyTheme(systemTheme);
        }

        setMounted(true);
    }, []);

    // Listen for system theme changes (only if user hasn't set a preference)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");

        function handleSystemChange(e: MediaQueryListEvent) {
            const stored = localStorage.getItem("devfolio-theme");
            if (!stored) {
                const newTheme: Theme = e.matches ? "dark" : "light";
                setTheme(newTheme);
                applyTheme(newTheme);
            }
        }

        mq.addEventListener("change", handleSystemChange);
        return () => mq.removeEventListener("change", handleSystemChange);
    }, []);

    function applyTheme(t: Theme) {
        const root = document.documentElement;
        if (t === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }

    function toggleTheme() {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        localStorage.setItem("devfolio-theme", next);
    }

    // Prevent flash: hide content until theme is applied
    if (!mounted) {
        return (
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <div style={{ visibility: "hidden" }}>{children}</div>
            </ThemeContext.Provider>
        );
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}