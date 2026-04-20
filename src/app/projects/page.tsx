import { scanAllProjects } from "@/lib/projectScanner";
import { ProjectsClient } from "@/components/projects/ProjectsClient";
import { FolderOpen } from "lucide-react";

export const dynamic = "force-dynamic"; // always re-scan on each request

export default function ProjectsPage() {
    const projects = scanAllProjects();

    return (
        <div className="min-h-screen bg-surface-light dark:bg-surface-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* If no projects folder yet */}
                {projects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6 text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-border-light dark:border-border-dark flex items-center justify-center">
                            <FolderOpen size={32} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <div>
                            <h2 className="font-display text-2xl font-bold text-slate-700 dark:text-slate-300">
                                No projects found
                            </h2>
                            <p className="text-slate-400 dark:text-slate-500 mt-2 max-w-sm">
                                Paste your <span className="font-mono text-brand-500">imamuddin/</span> folder inside{" "}
                                <span className="font-mono text-brand-500">imam-portfolio/projects/</span> to get started.
                            </p>
                        </div>
                    </div>
                ) : (
                    <ProjectsClient projects={projects} />
                )}
            </div>
        </div>
    );
}