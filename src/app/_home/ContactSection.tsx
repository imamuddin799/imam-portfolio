"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/SocialIcons";
import { PERSONAL_INFO } from "@/lib/constants";

const CONTACT_INFO = [
    { icon: Mail, label: "Email", value: PERSONAL_INFO.email, href: `mailto:${PERSONAL_INFO.email}`, color: "text-brand-500", bg: "bg-brand-500/10" },
    { icon: Phone, label: "Phone", value: PERSONAL_INFO.phone, href: `tel:${PERSONAL_INFO.phone.replace(/\s/g, "")}`, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: MapPin, label: "Location", value: PERSONAL_INFO.location, href: null, color: "text-violet-500", bg: "bg-violet-500/10" },
];

export function ContactSection() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 4000);
    }

    const inputClass =
        "w-full px-4 py-3 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200";

    return (
        <section id="contact" className="py-20 bg-surface-light dark:bg-surface-dark transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-16">
                    <p className="text-brand-500 text-sm font-semibold uppercase tracking-widest mb-3">
                        Let&apos;s talk
                    </p>
                    <h2 className="font-display text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
                        Get In Touch
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-md mx-auto">
                        Have a project in mind or just want to say hello? I&apos;d love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                    {/* Left — Info */}
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            {CONTACT_INFO.map((item) => {
                                const Icon = item.icon;
                                const content = (
                                    <div className="flex items-center gap-4 p-5 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark hover:border-brand-500/30 hover:shadow-card-md transition-all duration-300 group">
                                        <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <Icon size={20} className={item.color} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</p>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.value}</p>
                                        </div>
                                    </div>
                                );
                                return item.href ? (
                                    <a key={item.label} href={item.href}>{content}</a>
                                ) : (
                                    <div key={item.label}>{content}</div>
                                );
                            })}
                        </div>

                        {/* Social */}
                        <div>
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Find me on</p>
                            <div className="flex gap-3">
                                <a
                                    href={PERSONAL_INFO.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/40 text-sm font-medium transition-all duration-200"
                                >
                                    <GithubIcon size={16} />
                                    GitHub
                                </a>
                                <a
                                    href={PERSONAL_INFO.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-500/40 text-sm font-medium transition-all duration-200"
                                >
                                    <LinkedinIcon size={16} />
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="p-6 sm:p-8 rounded-3xl border border-border-light dark:border-border-dark bg-white dark:bg-card-dark shadow-card">
                        {submitted ? (
                            <div className="h-full flex flex-col items-center justify-center gap-4 py-12 animate-fade-in">
                                <CheckCircle size={48} className="text-emerald-500" />
                                <p className="font-display text-xl font-bold text-slate-900 dark:text-white">Message Sent!</p>
                                <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                                    Thanks for reaching out. I&apos;ll get back to you soon.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your Name</label>
                                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Hi Imamuddin, I'd love to connect..." className={`${inputClass} resize-none`} />
                                </div>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <Send size={16} />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}