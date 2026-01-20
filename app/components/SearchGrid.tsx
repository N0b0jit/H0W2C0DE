"use client";

import { useState, useMemo } from "react";
import Fuse from "fuse.js";
import Card from "./Card";
import CategoryFilter from "./CategoryFilter";
import { Search, Command, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchGridProps {
    posts: any[];
}

export default function SearchGrid({ posts }: SearchGridProps) {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [isFocused, setIsFocused] = useState(false);

    // Fuse configuration
    const fuse = useMemo(() => {
        return new Fuse(posts, {
            keys: ["title", "slug", "tags"],
            threshold: 0.3,
        });
    }, [posts]);

    // Helper to infer category if missing in data
    const getPostCategory = (post: any) => {
        // Check explicit tags/categories first if available (our new files have them)
        // But for a mix of old/new, simple keyword inference is consistent.
        const text = (post.slug + " " + (post.title || "")).toLowerCase();

        if (text.includes("excel") || text.includes("word") || text.includes("adobe") || text.includes("photoshop")) return "software";
        if (text.includes("linux") || text.includes("windows") || text.includes("macos") || text.includes("cmd")) return "os";
        if (text.includes("sql") || text.includes("mongo") || text.includes("redis")) return "database";
        if (text.includes("react") || text.includes("vue") || text.includes("angular") || text.includes("next")) return "framework";
        if (text.includes("git") || text.includes("docker") || text.includes("vim") || text.includes("npm") || text.includes("bash")) return "tool";

        // Default catch-all
        return "language";
    };

    const results = useMemo(() => {
        // 1. Text Search
        let filtered = query
            ? fuse.search(query).map((result) => result.item)
            : posts;

        // 2. Category Filter
        if (category !== "all") {
            filtered = filtered.filter(post => {
                return getPostCategory(post) === category;
            });
        }

        return filtered;
    }, [query, category, posts, fuse]);

    return (
        <div className="w-full max-w-[1600px] mx-auto z-10 relative">
            <div className={`sticky top-6 z-40 mb-8 flex flex-col items-center transition-all duration-300 ${isFocused ? '-translate-y-2' : ''}`}>
                <div className={`relative w-full max-w-2xl group transition-all duration-300 ${isFocused ? 'scale-105' : ''} mb-6`}>
                    {/* Ambient Glow behind search */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                    <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center shadow-2xl">
                        <div className="pl-4 text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            className="w-full bg-transparent border-none text-white px-4 py-4 text-lg focus:outline-none placeholder:text-gray-600"
                            placeholder="Search 200+ cheat sheets (e.g. 'Excel', 'Linux')..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                        <div className="pr-4 flex items-center gap-2">
                            {query && (
                                <button onClick={() => setQuery("")} className="hover:bg-white/10 p-1 rounded-full text-gray-400 hover:text-white transition">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                            {!query && (
                                <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-xs text-gray-500 font-mono">
                                    <Command className="w-3 h-3" /> K
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category Chips */}
                <CategoryFilter currentCategory={category} onSelectCategory={setCategory} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                <AnimatePresence>
                    {results.map((post: any, index: number) => (
                        <Card
                            key={post.slug}
                            title={post.title}
                            slug={post.slug}
                            background={post.background}
                            index={index}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {results.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                        <Search className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300">No results found</h3>
                    <p className="text-gray-500 mt-2">Try adjusting your search or category filter.</p>
                </motion.div>
            )}
        </div>
    );
}
