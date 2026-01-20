
export interface Section {
    title: string;
    id: string;
    elements: ContentElement[];
}

export type ContentElement =
    | { type: 'text'; content: string }
    | { type: 'code'; content: string; language: string }
    | { type: 'table'; content: string };

function slugify(text: string) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export function parseContentToSections(markdown: string): Section[] {
    const sections: Section[] = [];
    const lines = markdown.split("\n");

    let currentTitle = "Introduction";
    let buffer: string[] = [];

    const flushBuffer = () => {
        if (buffer.length > 0) {
            sections.push({
                title: currentTitle,
                id: slugify(currentTitle),
                elements: parseMarkdownBlock(buffer.join("\n"))
            });
            buffer = [];
        }
    };

    lines.forEach(line => {
        if (line.match(/^(#{2,3})\s/)) {
            flushBuffer();

            currentTitle = line.replace(/^(#{2,3})\s/, "").trim();
            currentTitle = currentTitle.replace(/\{.*?\}/, "").trim();
        } else {
            buffer.push(line);
        }
    });

    flushBuffer();
    return sections;
}

function parseMarkdownBlock(text: string): ContentElement[] {
    const elements: ContentElement[] = [];
    const parts = text.split(/(```[\w-\s]*\n[\s\S]*?```)/g);

    parts.forEach(part => {
        if (!part.trim()) return;

        if (part.startsWith('```')) {
            const match = part.match(/```([\w-\s]*)\n([\s\S]*?)```/);
            if (match) {
                elements.push({
                    type: 'code',
                    language: match[1] || 'bash',
                    content: match[2]
                });
                return;
            }
        }

        if (part.trim().match(/^\|.*\|$/m)) {
            const pipes = part.match(/\|/g);
            if (pipes && pipes.length > 4) {
                elements.push({ type: 'table', content: part });
                return;
            }
        }

        elements.push({ type: 'text', content: part });
    });

    return elements;
}
