# Imam-Portfolio — Developer Portfolio

A modern, full-featured developer portfolio built with **Next.js 16**, **Tailwind CSS v4**, and **TypeScript**. It automatically scans a local `projects/` folder and turns every project into a browsable, filterable card with a live demo (for React/HTML projects) and an in-browser code viewer with syntax highlighting.

> **This is a template.** Fork it, update `constants.ts` with your details, drop your projects into the `projects/` folder, and deploy.

---

## ✨ Features

- **Auto-scanned project gallery** — drop a folder into `projects/` and it appears on the site automatically
- **Live demo viewer** — React/Vite projects are built and served in an iframe with desktop / tablet / mobile viewport switching
- **In-browser code viewer** — file tree explorer + Shiki syntax highlighting (GitHub Dark & Light themes)
- **Dark / Light theme** — persisted in `localStorage`, respects system preference, no flash on load
- **Responsive design** — works on all screen sizes
- **Animated stats, typewriter hero, filterable skills grid, contact form**
- **One-command deploy** to Vercel via `deploy.cjs`

---

## 🗂️ Project Structure

```
imam-portfolio/
├── src/
│   ├── app/
│   │   ├── _home/               # Home page sections (Hero, Stats, Skills, About, Contact)
│   │   ├── api/                 # API routes (demo serving, file content, asset proxy)
│   │   │   ├── demo-html/       # Serves plain HTML/JS project demos
│   │   │   ├── demo-react/      # Serves built React/Vite demos
│   │   │   ├── demo-react-asset/# Serves JS/CSS/image assets for React builds
│   │   │   ├── demo-asset/      # Serves assets for plain HTML projects
│   │   │   ├── demo-status/     # "Build required" page shown before a React project is built
│   │   │   ├── file-content/    # Returns file text + Shiki-highlighted HTML
│   │   │   └── project-file/    # Serves images/PDFs from project folders for preview
│   │   ├── code/[...slug]/      # Code viewer page
│   │   ├── demo/[...slug]/      # Live demo page
│   │   ├── projects/            # Projects listing page
│   │   ├── layout.tsx           # Root layout (fonts, metadata, theme anti-flash script)
│   │   └── page.tsx             # Home page
│   ├── components/
│   │   ├── code-viewer/         # FileTree, FileTreeNode, CodePanel, CodeToolbar
│   │   ├── demo/                # DemoViewer, DemoToolbar, DemoUnavailable, EnvWarningBanner
│   │   ├── icons/               # GitHub & LinkedIn SVG icons
│   │   ├── layout/              # Navbar, Footer
│   │   ├── projects/            # ProjectCard, ProjectFilters, ProjectTypeBadge, ProjectsStats
│   │   └── providers/           # ThemeProvider
│   └── lib/
│       ├── constants.ts         # ← YOUR PERSONAL INFO, SKILLS, COLORS (edit this)
│       ├── projectScanner.ts    # Filesystem scanner — reads the projects/ folder at runtime
│       ├── demoResolver.ts      # Decides the demo URL for each project
│       └── types.ts             # TypeScript types
├── projects/
│   └── imamuddin/                    # ← DROP YOUR PROJECTS HERE (rename "imamuddin" to your name)
│       ├── Day 1/
│       │   └── my-react-app/    # A React project (has package.json + react dep)
│       ├── Day 2/
│       │   └── todo-html/       # An HTML/JS project (has index.html)
│       └── tasks/
│           └── spring-api/      # A Spring Boot project (has pom.xml)
├── public/
│   └── builds/                  # ← Auto-generated React build output (git-ignored)
├── scripts/
│   └── build-all.cjs            # Builds all React projects under projects/
├── deploy.cjs                   # Vercel deployment helper script
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── vercel.json
└── .vercelignore
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the repository

```bash
git clone https://github.com/imamuddin799/imam-portfolio.git
cd imam-portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Personalize your info

Open `src/lib/constants.ts` and replace every value under `PERSONAL_INFO` with your own details:

```ts
export const PERSONAL_INFO = {
    name: "Your Full Name",
    firstName: "Your",
    lastName: "Name",
    title: "Full Stack Developer",
    titleTags: ["React", "Next.js", "Java", "Spring Boot"],
    email: "you@example.com",
    phone: "+91 XXXXX XXXXX",
    location: "Your City, Country",
    hometown: "District, State",
    github: "https://github.com/your-username",
    linkedin: "https://www.linkedin.com/in/your-profile",
    bio: "Write a short bio about yourself here.",
    education: {
        degree: "B.Tech in Computer Science and Engineering",
        institute: "Your College Name",
        location: "Your College City",
        year: "2024",
    },
} as const;
```

You can also edit `SKILLS` to reflect your actual skill set and proficiency levels (0–100).

### 4. Add your resume

Place your resume PDF at:

```
public/files/resume.pdf
```

The "Resume" button on the Hero section will download this file.

### 5. Rename the projects folder

The scanner looks for projects inside `projects/imamuddin/`. Rename the `imamuddin` folder to your own name (or any label you prefer), then update the path in two places:

**`src/lib/projectScanner.ts`**, line 7:
```ts
const PROJECTS_ROOT = path.join(process.cwd(), "projects", "your-name");
```

**`scripts/build-all.cjs`**, line 8:
```js
const PROJECTS_ROOT = path.join(__dirname, "..", "projects", "your-name");
```

### 6. Add your projects

Drop your project folders inside `projects/your-name/`. The scanner detects the project type automatically:

| What it looks for | Detected as |
|---|---|
| `package.json` with `react` dep | React |
| `index.html` (no package.json) | HTML/JS |
| `pom.xml` or `build.gradle` | Spring Boot |
| `.java` files | Java |
| `.sql` files | SQL |

You can organize projects however you like:

```
projects/your-name/
├── Day 1/                    # Day label shown on the card
│   └── counter-app/          # React project (has package.json)
├── Day 2/
│   ├── todo-list/            # HTML/JS project
│   └── calculator/           # Another HTML/JS project
└── tasks/                    # No day label
    └── bank-management/      # Java project
```

### 7. Build React projects (optional, for live demos)

React and Vite projects need to be built before they can be previewed in the iframe. Run:

```bash
# Build all React projects
npm run build:projects

# Or build a specific project
node scripts/build-all.cjs "Day 1/counter-app"
```

Built output goes into `public/builds/` and is served through the `/api/demo-react` route. Projects that have not been built will display a "Build Required" message in the demo iframe instead of an error.

### 8. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🎨 Customization

### Theme colors

The brand color (sky blue by default) is defined in `src/app/globals.css` under `@theme`:

```css
--color-brand-500: #0ea5e9;  /* Change this to your preferred accent color */
```

Update `brand-50` through `brand-900` to match your chosen color. You can use any Tailwind color palette as a reference.

### Skills

Edit the `SKILLS` array in `src/lib/constants.ts`. Each skill needs a `name`, `category` (one of `Frontend`, `Backend`, `Database`, `DevOps`), and a `level` from 0 to 100.

### Tech tag colors

`TECH_COLORS` in `constants.ts` maps technology names to Tailwind color classes. Add an entry for any new technology you add to your skills or project tags.

### Stats section

The four animated counters in `StatsSection.tsx` are hardcoded. Update the `STATS` array in `src/app/_home/StatsSection.tsx` to reflect your actual numbers.

### Rotating titles in the hero

Edit the `ROTATING_TITLES` array at the top of `src/app/_home/HeroSection.tsx`:

```ts
const ROTATING_TITLES = [
    "Full Stack Developer",
    "React.js Developer",
    // add or remove titles here
];
```

### Open Graph / SEO metadata

Edit the `metadata` object in `src/app/layout.tsx` to set your page title, description, and Open Graph tags.

---

## 📦 How the Project Scanner Works

`projectScanner.ts` runs **at request time on the server** (it is not cached at build time). It:

1. Walks the `projects/your-name/` directory up to 3 levels deep
2. Identifies project roots by looking for `package.json`, `index.html`, `pom.xml`, `.java`, or `.sql` files
3. Detects the project type, generates tags from `package.json` dependencies, and builds a file tree
4. Returns a `Project[]` array that the `/projects` page and all API routes use

Because it reads from disk on every request, **adding a new project folder requires no restart** in development — just refresh the page.

### Project type detection logic

```
Has pom.xml or build.gradle?  → Spring Boot
Has package.json with react?  → React
Has any .java files?          → Java
Has any .sql files?           → SQL
Has index.html?               → HTML/JS
Otherwise                     → Other
```

---

## 🖥️ Live Demo System

### HTML/JS projects

Served through `/api/demo-html`. The route reads `index.html`, rewrites all relative asset URLs (scripts, stylesheets, images) to go through `/api/demo-asset`, and returns the patched HTML to the iframe. No build step needed.

### React/Vite projects

1. Run `npm run build:projects` to build the project with Vite
2. The build output is copied to `public/builds/<slug>/`
3. `index.html` and all JS/CSS files have their asset paths rewritten to go through `/api/demo-react-asset`
4. The demo iframe loads `/api/demo-react` which serves the patched `index.html` plus a runtime shim that catches any dynamic asset loads

Projects that have not been built show a "Build Required" page inside the iframe with instructions.

### Java / Spring Boot / SQL projects

These cannot run in the browser. Clicking "Live Demo" shows a `DemoUnavailable` screen explaining why and showing the command to run the project locally.

---

## 🌐 Deployment

### Deploy to Vercel (recommended)

The easiest path is the included deploy script:

```bash
# Preview deployment
node deploy.cjs

# Production deployment
node deploy.cjs --prod

# Production, skip rebuilding React projects
node deploy.cjs --skip-build --prod
```

This script:
1. Checks that the Vercel CLI is installed (`npm install -g vercel` if not)
2. Runs `build-all.cjs` to build all React projects
3. Runs `vercel --prod` to deploy

**Requirements:**
- Vercel CLI installed globally: `npm install -g vercel`
- Logged in: `vercel login`

### Manual Vercel deployment

```bash
# Build React projects first
npm run build:projects

# Deploy
vercel --prod
```

### Environment variables

This project has **no required environment variables** for the portfolio itself. If any of your sub-projects inside `projects/` use `.env` files, they will not be committed (`.env` files are excluded by the scanner and `.vercelignore`). The portfolio will display an "Requires environment variables" warning badge on those project cards automatically.

### Important: `projects/` folder on Vercel

Vercel does **not** have access to your local `projects/` folder unless you commit it to the repository. You have two options:

**Option A — Commit your projects** (simplest): Add `projects/` to git and push. Make sure no `.env` files are inside (the `.vercelignore` excludes them).

**Option B — Pre-build only**: Run `npm run build:projects` locally, commit only the `public/builds/` output, and exclude the source `projects/` folder. The code viewer will not work for un-committed projects but the demos will.

---

## 🔧 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Build the Next.js app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run build:projects` | Build all React sub-projects under `projects/` |
| `node deploy.cjs` | Preview deploy to Vercel |
| `node deploy.cjs --prod` | Production deploy to Vercel |
| `node scripts/build-all.cjs "Day 1/my-app"` | Build a single React project by slug |

---

## 🧩 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Fonts | Geist Sans, Geist Mono, Syne (via `next/font/google`) |
| Syntax Highlighting | Shiki v4 (GitHub Dark + GitHub Light themes) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📁 Key Files Reference

| File | Purpose |
|---|---|
| `src/lib/constants.ts` | **Your personal info, skills, colors** — edit this first |
| `src/lib/projectScanner.ts` | Reads the `projects/` folder and builds project metadata |
| `src/lib/demoResolver.ts` | Maps a project to its demo URL |
| `src/app/globals.css` | Global styles, Tailwind v4 theme tokens, custom animations |
| `src/components/providers/ThemeProvider.tsx` | Dark/light theme with localStorage persistence |
| `scripts/build-all.cjs` | CLI script to build all React sub-projects |
| `deploy.cjs` | Vercel deployment helper |
| `vercel.json` | Vercel config (region: Mumbai, 30s function timeout) |
| `.vercelignore` | Excludes `node_modules`, `.env` files, and `scripts/` from Vercel upload |

---

## 🤝 Using This as a Template

1. Fork or clone this repository
2. Update `PERSONAL_INFO` in `src/lib/constants.ts`
3. Update `SKILLS` and proficiency levels
4. Rename `projects/imamuddin/` → `projects/your-name/` and update the path in `projectScanner.ts` and `build-all.cjs`
5. Add your projects to the folder
6. Replace `public/files/resume.pdf` with your resume
7. Update the metadata in `src/app/layout.tsx`
8. Run `npm run build:projects` if you have React projects
9. Deploy with `node deploy.cjs --prod`

---

## 📄 License

This project is open-source. Feel free to use it as a template for your own portfolio. A credit or star is appreciated but not required.

---

*Built with Next.js & Tailwind CSS*