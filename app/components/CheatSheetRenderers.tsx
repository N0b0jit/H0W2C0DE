"use client";

import { Hash } from "lucide-react";
import CodeBlock from "./CodeBlock";
import { type Section } from "../lib/markdown";

function TextRenderer({ content }: { content: string }) {
    let html = content
        .replace(/^#### (.*$)/gim, '<h4 class="text-sm font-bold text-gray-300 mt-4 mb-2 uppercase tracking-wider">$1</h4>')
        .replace(/\*\*(.*)\*\*/gim, '<strong class="text-white font-semibold">$1</strong>')
        .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono text-sm border border-white/5">$1</code>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-brand hover:underline transition-colors">$1</a>')
        .replace(/\n\n/g, '<br/><div class="h-2"></div>')
        .replace(/<pur>(.*?)<\/pur>/g, '<span class="text-purple-400">$1</span>')
        .replace(/<yel>(.*?)<\/yel>/g, '<span class="text-yellow-400">$1</span>');

    return <div className="text-gray-400 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
}

function TableRenderer({ content }: { content: string }) {
    const rows = content.trim().split("\n").filter(r => r.trim());
    return (
        <div className="overflow-x-auto my-4 border border-white/5 rounded-lg bg-black/20">
            <table className="w-full text-left text-sm border-collapse">
                <tbody>
                    {rows.map((row, i) => {
                        if (row.match(/\|[\s-]*\|/)) return null;
                        const cells = row.split("|").filter(c => c.trim() !== "");
                        const isHeader = i === 0;
                        return (
                            <tr key={i} className={isHeader ? "bg-white/5 font-semibold text-gray-200" : "border-t border-white/5 text-gray-400 hover:bg-white/5 transition-colors"}>
                                {cells.map((cell, j) => (
                                    <td key={j} className="p-3 border-r border-white/5 last:border-0" dangerouslySetInnerHTML={{
                                        __html: cell.replace(/<yel>(.*?)<\/yel>/g, '<span class="text-yellow-400">$1</span>')
                                            .replace(/`([^`]+)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-blue-300 font-mono text-xs">$1</code>')
                                            .trim()
                                    }} />
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export function SectionRenderer({ section }: { section: Section }) {
    return (
        <div id={section.id} className="scroll-mt-24 bg-secondary/20 border border-white/5 rounded-2xl p-6 hover:border-white/10 hover:shadow-2xl hover:shadow-brand/5 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Hash className="w-4 h-4 text-gray-600" />
                <h3 className="text-lg font-bold text-white tracking-tight">{section.title}</h3>
            </div>
            <div className="space-y-4">
                {section.elements.map((el, i) => {
                    if (el.type === 'code') return <CodeBlock key={i} code={el.content} language={el.language} />;
                    if (el.type === 'table') return <TableRenderer key={i} content={el.content} />;
                    return <TextRenderer key={i} content={el.content} />;
                })}
            </div>
        </div>
    );
}
