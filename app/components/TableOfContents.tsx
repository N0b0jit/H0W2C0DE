"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TOCProps {
    sections: { title: string; id: string }[];
}

export default function TableOfContents({ sections }: TOCProps) {
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -60% 0px" }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sections]);

    const handleScrollTo = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 100, // Offset for sticky header if any, or general breathing room
                behavior: "smooth"
            });
            setActiveId(id);
        }
    };

    if (sections.length === 0) return null;

    return (
        <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pl-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">On this page</h4>
            <div className="space-y-1 relative border-l border-white/10">
                {/* Active Indicator Line */}
                <motion.div
                    className="absolute left-[-1px] w-[2px] bg-brand h-6 rounded-full"
                    layoutId="activeSection"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    // We need to calculate top position based on active index. 
                    // Simpler approach: Just style the link border.
                    style={{ display: 'none' }}
                />

                {sections.map((section) => (
                    <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => handleScrollTo(section.id, e)}
                        className={`block py-1 pl-4 text-sm transition-colors border-l-2 ${activeId === section.id
                                ? "border-blue-500 text-blue-400 font-medium"
                                : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/20"
                            }`}
                    >
                        {section.title}
                    </a>
                ))}
            </div>
        </nav>
    );
}
