"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye } from "lucide-react";

interface CardProps {
    title: string;
    slug: string;
    background?: string;
    index: number;
    onHover: (slug: string) => void;
    onLeave: () => void;
    onPreview: (slug: string) => void;
}

export default function Card({ title, slug, background, index, onHover, onLeave, onPreview }: CardProps) {
    // Fallback cool colors if no color found
    const colorMatch = background?.match(/bg-\[(#.*?)\]/);
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
    const deterministicColor = colorMatch ? colorMatch[1] : colors[title.length % colors.length];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ y: -5 }}
            className="h-full"
            onMouseEnter={() => onHover(slug)}
            onMouseLeave={onLeave}
        >
            <Link href={`/${slug}`} className="block h-full group relative">
                <div className="h-full bg-secondary/30 hover:bg-secondary/50 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all duration-300 backdrop-blur-sm overflow-hidden flex flex-col justify-between">

                    {/* Internal Glow */}
                    <div
                        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                        style={{ background: deterministicColor }}
                    />

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-inner"
                                style={{
                                    background: `linear-gradient(135deg, ${deterministicColor}20, ${deterministicColor}05)`,
                                    boxShadow: `inset 0 0 0 1px ${deterministicColor}40`
                                }}
                            >
                                {title.slice(0, 1).toUpperCase()}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onPreview(slug);
                                    }}
                                    className="p-1.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
                                    title="Quick Look (Space)"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <ArrowUpRight className="w-4 h-4 text-gray-500 hover:text-white" />
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors mb-1 tracking-tight">
                            {title}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center justify-between">
                            <span>Cheat Sheet</span>
                            <span className="opacity-0 group-hover:opacity-50 text-[10px] bg-white/10 px-1.5 rounded">Space</span>
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
