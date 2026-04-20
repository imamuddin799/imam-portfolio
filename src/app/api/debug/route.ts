// Create: src/app/api/debug/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    const root = path.resolve(process.cwd(), 'projects', 'imamuddin');
    try {
        const files = fs.readdirSync(root);
        return NextResponse.json({ path: root, files });
    } catch (e) {
        return NextResponse.json({ error: "Could not read directory", path: root });
    }
}