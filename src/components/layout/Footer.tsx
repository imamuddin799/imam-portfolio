import Link from "next/link";
import { Mail, Phone, Code2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { PERSONAL_INFO } from "@/lib/constants";

const SOCIAL_LINKS = [
  { label: "GitHub", href: PERSONAL_INFO.github, icon: GithubIcon },
  { label: "LinkedIn", href: PERSONAL_INFO.linkedin, icon: LinkedinIcon },
  { label: "Email", href: `mailto:${PERSONAL_INFO.email}`, icon: Mail },
  { label: "Phone", href: `tel:${PERSONAL_INFO.phone.replace(/\s/g, "")}`, icon: Phone },
];

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Skills", href: "/#skills" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-light dark:border-border-dark bg-white dark:bg-card-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-bold text-xl text-slate-900 dark:text-white w-fit"
            >
              <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <Code2 size={18} className="text-white" />
              </span>
              <span>Imam<span className="text-brand-500">.</span>dev</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              Full Stack Developer building modern web applications with React, Next.js, Java and Spring Boot.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Connect
            </h3>
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors group"
                    >
                      <Icon size={15} className="group-hover:scale-110 transition-transform" />
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} Imamuddin Ansari. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built with <span className="text-brand-500">Next.js</span> & <span className="text-brand-500">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
}