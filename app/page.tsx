import { getAllPosts } from "./lib/api";
import SearchGrid from "./components/SearchGrid";
import { Terminal } from "lucide-react";

export default function Home() {
  const posts = getAllPosts();
  const serializedPosts = posts.map(p => ({
    slug: p.slug,
    title: p.title,
    background: p.background
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Navigation / Brand */}
        <nav className="flex justify-between items-center mb-16 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-400 rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
              <Terminal className="text-black w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">How2Code</span>
          </div>

          <a
            href="https://github.com/N0b0jit/H0W2C0DE"
            target="_blank"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors border border-white/5 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full"
          >
            Star on GitHub
          </a>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-blue-300 mb-6 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            v2.0 Redesigned
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl mx-auto">
            <span className="text-gradient">Master the syntax</span>
            <br />
            <span className="text-gray-500">of every language.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            The developers' ultra-fast, community-driven reference library.
            <br className="hidden md:block" />
            Designed for speed, built for builders.
          </p>
        </div>

        <SearchGrid posts={serializedPosts} />

        <footer className="mt-32 border-t border-white/5 pt-8 pb-12 text-center text-sm text-gray-600">
          <p>© 2026 How2Code. Data sourced from Fechin/reference.</p>
        </footer>
      </main>
    </div>
  );
}
