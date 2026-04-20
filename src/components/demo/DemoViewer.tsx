"use client";

import { useState, useCallback, useRef } from "react";
import { DemoToolbar } from "@/components/demo/DemoToolbar";
import { EnvWarningBanner } from "@/components/demo/EnvWarningBanner";
import { DemoUnavailable } from "@/components/demo/DemoUnavailable";
import { Loader2 } from "lucide-react";
import type { Project } from "@/lib/types";

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
    desktop: "100%",
    tablet: "768px",
    mobile: "390px",
};

interface Props {
    project: Project;
    slugPath: string;
    demoSrc: string | null;
}

export function DemoViewer({ project, slugPath, demoSrc }: Props) {
    const [viewport, setViewport] = useState<Viewport>("desktop");
    const [iframeKey, setIframeKey] = useState(0);
    const [iframeReady, setIframeReady] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleRefresh = useCallback(() => {
        setIframeReady(false);
        setIframeKey((k) => k + 1);
    }, []);

    // Project has no live demo (Java, SQL, etc.)
    if (!project.hasLiveDemo || !demoSrc) {
        return (
            <div className="flex flex-col h-[calc(100vh-64px)] bg-surface-light dark:bg-surface-dark">
                <DemoToolbar
                    project={project}
                    slugPath={slugPath}
                    demoSrc=""
                    viewport={viewport}
                    onViewport={setViewport}
                    onRefresh={handleRefresh}
                />
                <DemoUnavailable project={project} slugPath={slugPath} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-surface-light dark:bg-surface-dark">

            {/* Toolbar */}
            <DemoToolbar
                project={project}
                slugPath={slugPath}
                demoSrc={demoSrc}
                viewport={viewport}
                onViewport={setViewport}
                onRefresh={handleRefresh}
            />

            {/* .env warning */}
            {project.hasEnvFile && <EnvWarningBanner />}

            {/* Iframe area */}
            <div className="flex-1 overflow-hidden flex items-start justify-center bg-slate-200 dark:bg-slate-900 p-0 md:p-4 transition-colors duration-300">
                <div
                    className="relative h-full bg-white shadow-2xl transition-all duration-500 overflow-hidden"
                    style={{
                        width: VIEWPORT_WIDTHS[viewport],
                        maxWidth: "100%",
                        borderRadius: viewport === "desktop" ? "0" : "16px",
                        marginTop: viewport === "desktop" ? "0" : "auto",
                        marginBottom: viewport === "desktop" ? "0" : "auto",
                    }}
                >
                    {/* Loading overlay */}
                    {!iframeReady && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-card-dark z-10">
                            <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                                <Loader2 size={28} className="animate-spin text-brand-500" />
                                <p className="text-sm font-medium">Loading demo...</p>
                            </div>
                        </div>
                    )}

                    {/* Iframe */}
                    <iframe
                        key={iframeKey}
                        ref={iframeRef}
                        src={demoSrc}
                        title={`${project.title} — Live Demo`}
                        onLoad={() => setIframeReady(true)}
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
                        allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone"
                    />
                </div>
            </div>

            {/* Viewport label — shown on tablet/mobile view */}
            {viewport !== "desktop" && (
                <div className="flex justify-center py-2 shrink-0">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {viewport === "tablet" ? "Tablet — 768px" : "Mobile — 390px"}
                    </span>
                </div>
            )}
        </div>
    );
}