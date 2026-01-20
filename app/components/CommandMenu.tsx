"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Command, X, ArrowRight } from "lucide-react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";

// Simplified type for search items
interface SearchItem {
    title: string;
    slug: string;
    category?: string;
}

export default function CommandMenu({ items }: { items: SearchItem[] }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    // Toggle with Cmd+K
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const fuse = useMemo(() => {
        return new Fuse(items, {
            keys: ["title", "slug"],
            threshold: 0.3,
        });
    }, [items]);

    const results = useMemo(() => {
        if (!query) return items.slice(0, 5); // Default show top 5
        return fuse.search(query).map((res) => res.item).slice(0, 8);
    }, [query, items, fuse]);

    const handleSelect = (slug: string) => {
        setOpen(false);
        router.push(`/${slug}`);
    };

    // Keyboard navigation within the menu
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % results.length);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (results[activeIndex]) {
                    handleSelect(results[activeIndex].slug);
                }
            } else if (e.key === "Escape") {
                setOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, activeIndex, results]);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-lg bg-[#111] border border-white/10 rounded-xl shadow-2xl shadow-blue-900/20 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center px-4 py-4 border-b border-white/5 gap-3">
                            <Search className="w-5 h-5 text-gray-500" />
                            <input
                                autoFocus
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                                placeholder="Type a command or search..."
                                className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-gray-600 text-lg"
                            />
                            <div className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400">ESC</div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[300px] overflow-y-auto py-2">
                            {results.length === 0 && (
                                <div className="px-4 py-8 text-center text-gray-500 text-sm">
                                    No results found.
                                </div>
                            )}

                            {results.map((item, idx) => (
                                <div
                                    key={item.slug}
                                    onClick={() => handleSelect(item.slug)}
                                    onMouseEnter={() => setActiveIndex(idx)}
                                    className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg cursor-pointer transition-colors ${idx === activeIndex ? "bg-blue-600/20 text-white" : "text-gray-400 hover:bg-white/5"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Command className="w-4 h-4 opacity-50" />
                                        <span className={`${idx === activeIndex ? "text-white" : "text-gray-300"}`}>{item.title}</span>
                                    </div>
                                    {idx === activeIndex && <ArrowRight className="w-4 h-4 opacity-50 block" />}
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex gap-4">
                                <span>Change theme</span>
                                <span>Documentation</span>
                            </div>
                            <div>Search by How2Code</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
