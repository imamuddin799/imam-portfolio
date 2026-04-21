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
    console.log('Demo page execution start');
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) notFound();

    const slugPath = slug.join("/");
    const demoSrc = resolveDemoSrc(project);

    console.log('slug>>>', slug);
    console.log('project>>>', project);
    console.log('slug path>>>', slugPath);
    console.log('demo src>>>', demoSrc);
    return (
        <DemoViewer
            project={project}
            slugPath={slugPath}
            demoSrc={demoSrc}
        />
    );
}