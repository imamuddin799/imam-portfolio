"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

export function EnvWarningBanner() {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed) return null;

    return (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 shrink-0 animate-fade-in">
            <AlertTriangle size={14} className="text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 flex-1">
                <span className="font-semibold">Heads up:</span> This project requires
                environment variables. Some features may not work in the live demo.
            </p>
            <button
                onClick={() => setDismissed(true)}
                className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors shrink-0"
                aria-label="Dismiss"
            >
                <X size={14} />
            </button>
        </div>
    );
}