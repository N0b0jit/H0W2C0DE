import { getPostBySlug, getAllPosts } from "../lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Share2, Hash } from "lucide-react";
import RelatedPosts from "../components/RelatedPosts";
import TableOfContents from "../components/TableOfContents";
import { SectionRenderer } from "../components/CheatSheetRenderers";
import { parseContentToSections } from "../lib/markdown";

// --- Main Page Component ---

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) notFound();

    const sections = parseContentToSections(post.content);

    // Get Related Posts (Simple logic: Random 3 for now, or adjacent)
    const allPosts = getAllPosts();
    // Filter out current
    const otherPosts = allPosts.filter(p => p.slug !== slug);
    // Pick 3 random
    const related = otherPosts.sort(() => 0.5 - Math.random()).slice(0, 3);


    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 relative z-10">
                <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition text-gray-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1 capitalize">{post.title}</h1>
                            <p className="text-gray-500 flex items-center gap-2 text-sm">
                                Reference Sheet
                                <span className="w-1 h-1 rounded-full bg-gray-600" />
                                Updated 2026
                            </p>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium text-gray-300 transition group">
                        <Share2 className="w-4 h-4 group-hover:text-brand transition-colors" />
                        Share Guide
                    </button>
                </header>

                {/* Main Layout Grid: Content + TOC */}
                <div className="xl:grid xl:grid-cols-[1fr_240px] gap-12">

                    {/* Main Content Column */}
                    <div>
                        {/* Changed from masonry columns to vertical stack for TOC compatibility. 
                    Masonry + TOC is hard because order is visual, not DOM. 
                    Let's stick to single column vertical stack for specific tool pages 
                    to ensure TOC order matches visual order. 
                */}
                        <div className="space-y-8">
                            {sections.map((section, idx) => (
                                <SectionRenderer key={idx} section={section} />
                            ))}
                        </div>

                        <RelatedPosts currentSlug={slug} posts={related} />
                    </div>

                    {/* TOC Column (Right sticky) */}
                    <div className="hidden xl:block">
                        <TableOfContents sections={sections.map(s => ({ title: s.title, id: s.id }))} />
                    </div>

                </div>
            </div>
        </div>
    );
}
