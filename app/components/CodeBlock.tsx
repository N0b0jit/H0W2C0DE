"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, Terminal } from "lucide-react";

interface CodeBlockProps {
    code: string;
    language?: string;
}

export default function CodeBlock({ code, language = "bash" }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    // Clean language string (e.g. "shell script" -> "bash")
    const lang = language.trim().toLowerCase().replace("shell script", "bash");

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <div className="relative group my-4 rounded-xl overflow-hidden border border-white/10 bg-[#1e1e1e] shadow-2xl">
            {/* Header / Actions - Floating on hover or always visible? Always visible for usability */}
            <div className="flex justify-between items-center px-4 py-2 bg-[#252526] border-b border-black/50 select-none">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-mono text-gray-400 lowercase">{lang}</span>
                </div>

                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-white/10 transition-all text-xs text-gray-400 hover:text-white border border-transparent hover:border-white/5 active:scale-95"
                    title="Copy code"
                    aria-label="Copy to clipboard"
                >
                    {copied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-green-400" />
                            <span className="text-green-400 font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Syntax Highlighter */}
            <div className="relative">
                <SyntaxHighlighter
                    language={lang}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: "1.25rem",
                        background: "#1e1e1e", // Ensure matches container
                        fontSize: "0.85rem",
                        lineHeight: "1.6",
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                >
                    {code.trim()}
                </SyntaxHighlighter>

                {/* Subtle fade for long lines? No, wrapLongLines takes care of it. */}
            </div>
        </div>
    );
}
