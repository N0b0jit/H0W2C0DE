"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedPostsProps {
    currentSlug: string;
    posts: any[]; // Minimal post data
}

export default function RelatedPosts({ currentSlug, posts }: RelatedPostsProps) {
    if (posts.length === 0) return null;

    return (
        <div className="mt-20 border-t border-white/5 pt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Related Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map(post => (
                    <Link key={post.slug} href={`/${post.slug}`} className="group block bg-secondary/10 border border-white/5 hover:border-white/20 p-5 rounded-xl transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">{post.title}</h4>
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">View cheat sheet</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
