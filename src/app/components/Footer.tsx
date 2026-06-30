"use client";

import React from "react";
import { BorderBeam } from "@/components/magicui/border-beam";
import { IconBrandGithub, IconBrandX, IconBrandDiscord, IconHeart } from "@tabler/icons-react";
import Link from "next/link";

const Footer = () => {
    const sections = [
        {
            title: "Platform",
            links: [
                { label: "Home", href: "/" },
                { label: "Questions", href: "/questions" },
                { label: "Ask a Question", href: "/questions/ask" },
            ],
        },
        {
            title: "Company",
            links: [
                { label: "About", href: "/about" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms of Service", href: "/terms-of-service" },
            ],
        },
    ];

    const socials = [
        { label: "GitHub", icon: IconBrandGithub, href: "#" },
        { label: "X", icon: IconBrandX, href: "#" },
        { label: "Discord", icon: IconBrandDiscord, href: "#" },
    ];

    return (
        <footer className="relative px-4 pb-8 pt-24">
            <div className="container mx-auto">
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:p-12">
                    <BorderBeam size={250} duration={12} delay={9} />
                    <div className="grid gap-8 md:grid-cols-3">
                        <div className="md:col-span-1">
                            <Link
                                href="/"
                                className="bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-2xl font-bold tracking-tighter text-transparent"
                            >
                                RiverFlow
                            </Link>
                            <p className="mt-3 text-sm leading-relaxed text-white/50">
                                A community-driven Q&A platform for developers. Share knowledge,
                                solve problems, and grow together with fellow engineers worldwide.
                            </p>
                            <div className="mt-5 flex items-center gap-3">
                                {socials.map(({ label, icon: Icon, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        aria-label={label}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/50 transition-colors duration-200 hover:bg-orange-500/20 hover:text-orange-500"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                        {sections.map(section => (
                            <div key={section.title}>
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                                    {section.title}
                                </h3>
                                <ul className="space-y-2.5">
                                    {section.links.map(link => (
                                        <li key={link.href}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-white/60 transition-colors duration-200 hover:text-orange-500"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row">
                        <p>
                            &copy; {new Date().getFullYear()} RiverFlow. All rights reserved.
                        </p>
                        <p className="flex items-center gap-1">
                            Made with <IconHeart className="h-3 w-3 text-red-500" /> by the
                            RiverFlow team
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
