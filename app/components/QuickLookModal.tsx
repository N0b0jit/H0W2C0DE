"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Maximize2 } from "lucide-react";
import Link from "next/link";
import { SectionRenderer } from "./CheatSheetRenderers";
import { parseContentToSections } from "../lib/markdown";

interface QuickLookModalProps {
    slug: string | null;
    onClose: () => void;
}

export default function QuickLookModal({ slug, onClose }: QuickLookModalProps) {
    const [content, setContent] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/post?slug=${slug}`);
                if (!res.ok) throw new Error("Failed");
                const data = await res.json();
                setContent(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);

    }, [slug, onClose]);

    if (!slug) return null;

    // Parse only if content loaded
    const sections = content ? parseContentToSections(content.content) : [];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="absolute inset-0" onClick={onClose} />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-4xl h-[85vh] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#111]">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            {content?.title || "Loading..."} <span className="text-xs text-gray-600 font-mono ml-2 uppercase tracking-wide">Quick Look</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/${slug}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Maximize2 className="w-3 h-3" />
                                Open Full
                            </Link>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-gray-500 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                        {loading ? (
                            <div className="h-full flex items-center justify-center flex-col gap-4 text-gray-500">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p className="text-sm">Fetching cheat sheet...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sections.map((section, idx) => (
                                    <SectionRenderer key={idx} section={section} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Tip */}
                    <div className="bg-[#111] px-6 py-2 border-t border-white/5 text-[10px] text-gray-600 flex justify-between">
                        <span>Press <strong>ESC</strong> to close</span>
                        <span>Powered by How2Code</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
