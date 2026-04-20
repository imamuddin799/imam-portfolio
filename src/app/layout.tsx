import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Imamuddin Ansari — Full Stack Developer",
  description: "Portfolio of Imamuddin Ansari — Full Stack Developer specializing in React, Next.js, Java and Spring Boot.",
  keywords: ["Full Stack Developer", "React Developer", "Next.js", "Java", "Spring Boot", "Imamuddin Ansari"],
  authors: [{ name: "Imamuddin Ansari" }],
  openGraph: {
    title: "Imamuddin Ansari — Full Stack Developer",
    description: "Portfolio of Imamuddin Ansari — Full Stack Developer specializing in React, Next.js, Java and Spring Boot.",
    type: "website",
  },
};

// Inline script runs BEFORE React hydrates to prevent flash of wrong theme
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('devfolio-theme');
    if (stored === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (stored === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // No preference stored — use system setting
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-flash: apply theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} ${syne.variable}
          font-sans antialiased
          bg-white text-slate-900
          dark:bg-surface-dark dark:text-slate-100
        `}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}