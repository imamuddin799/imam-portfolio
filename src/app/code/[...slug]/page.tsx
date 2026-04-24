import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projectScanner";
import { CodeViewerClient } from "@/components/code-viewer/CodeViewerClient";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const project = getProjectBySlug(slug);
    if (!project) return { title: "Project Not Found" };
    return {
        title: `${project.title} — Code | Devfolio`,
        description: `Browse the source code of ${project.title}`,
    };
}

export default async function CodeViewerPage({ params }: Props) {
    // console.log('Code Viewer Page Executing');
    const { slug } = await params;
    // console.log('Slug Received for Code View:', slug);
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const slugPath = slug.join("/");
    // console.log("Slug Path for Code View:", slugPath);
    // console.log('Code viewer client called from code viewer page');
    return (
        <CodeViewerClient
            project={project}
            slugPath={slugPath}
        />
    );
}