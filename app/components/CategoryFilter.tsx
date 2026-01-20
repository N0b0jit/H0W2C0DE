"use client";

import { useState } from "react";
import {
    Code,
    Terminal,
    Monitor,
    Layout,
    Cpu,
    Database,
    Globe
} from "lucide-react";

interface CategoryFilterProps {
    currentCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ currentCategory, onSelectCategory }: CategoryFilterProps) {
    const categories = [
        { id: "all", label: "All", icon: Globe },
        { id: "language", label: "Languages", icon: Code },
        { id: "framework", label: "Frameworks", icon: Layout },
        { id: "tool", label: "Tools", icon: Terminal },
        { id: "database", label: "Databases", icon: Database },
        { id: "os", label: "System", icon: Monitor }, // For Linux, Windows
        { id: "software", label: "Software", icon: Cpu }, // For Excel, Word
    ];

    return (
        <div className="flex flex-wrap justify-center gap-2 mb-10 animate-fade-in">
            {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = currentCategory === cat.id;

                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive
                                ? "bg-white text-black shadow-lg shadow-white/20 scale-105"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            }
               `}
                    >
                        <Icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                );
            })}
        </div>
    );
}
