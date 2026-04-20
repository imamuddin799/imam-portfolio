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
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const slugPath = slug.join("/");

    return (
        <CodeViewerClient
            project={project}
            slugPath={slugPath}
        />
    );
}