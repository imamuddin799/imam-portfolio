import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/projectScanner";
import { resolveDemoSrc } from "@/lib/demoResolver";
import { DemoViewer } from "@/components/demo/DemoViewer";
import type { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return { title: "Demo Not Found" };
    return {
        title: `${project.title} — Live Demo | Devfolio`,
        description: `Live demo of ${project.title}`,
    };
}

export default async function DemoPage({ params }: Props) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const slugPath = slug.join("/");
    const demoSrc = resolveDemoSrc(project);

    return (
        <DemoViewer
            project={project}
            slugPath={slugPath}
            demoSrc={demoSrc}
        />
    );
}