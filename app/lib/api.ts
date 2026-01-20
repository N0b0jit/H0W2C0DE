import fs from "fs";
import path from "path";

const POSTS_DIRECTORY = path.join(process.cwd(), "data/reference/source/_posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  background: string;
  tags: string[];
  categories: string[];
  intro: string;
  content: string;
}

export interface Section {
  title: string;
  content: string; // HTML or Markdown
  classes: string[];
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }
  
  const filenames = fs.readdirSync(POSTS_DIRECTORY);
  
  const posts = filenames
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const slug = name.replace(/\.md$/, "");
      const fullPath = path.join(POSTS_DIRECTORY, name);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      
      // Simple Frontmatter Regex
      const match = /---\s*([\s\S]*?)\s*---/.exec(fileContents);
      const frontmatterRaw = match ? match[1] : "";
      const content = fileContents.replace(/---\s*[\s\S]*?\s*---/, "").trim();

      // Parse Frontmatter (Mocking gray-matter behavior roughly)
      const frontmatter: any = {};
      frontmatterRaw.split("\n").forEach(line => {
        const [key, ...rest] = line.split(":");
        if (key && rest.length) {
          const val = rest.join(":").trim();
          if (line.trim().startsWith("-")) {
            // Very simple list handling (fragile but fast for this dataset)
             // This regex parsing is too simple for nested lists in yaml.
             // We might skip complex tags for now or improve if needed.
          } else {
             frontmatter[key.trim()] = val.replace(/^['"]|['"]$/g, "");
          }
        }
      });

      // Better fallback for arrays if my simple parser fails
      // We will focus on Title and Intro mainly.
      
      // Refined Regex for specific fields keys
      const titleMatch = frontmatterRaw.match(/title:\s*(.*)/);
      const bgMatch = frontmatterRaw.match(/background:\s*(.*)/);
      const introMatch = frontmatterRaw.match(/intro:\s*\|([\s\S]*?)(?=\n\w)/); // Capture multi-line block

      return {
        slug,
        title: titleMatch ? titleMatch[1].trim() : slug,
        date: "",
        background: bgMatch ? bgMatch[1].trim() : "bg-gray-500",
        tags: [],
        categories: [],
        intro: introMatch ? introMatch[1].trim() : "",
        content
      };
    });

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(POSTS_DIRECTORY, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, "utf8");
   // Reuse parsing logic or duplicate for single file optimization
   // For now, assume getAllPosts is fast enough or refactor later.
   // Let's do a quick parse here.
   
    const match = /---\s*([\s\S]*?)\s*---/.exec(fileContents);
    const frontmatterRaw = match ? match[1] : "";
    const content = fileContents.replace(/---\s*[\s\S]*?\s*---/, "").trim();

    const titleMatch = frontmatterRaw.match(/title:\s*(.*)/);
    const bgMatch = frontmatterRaw.match(/background:\s*(.*)/);
    
    return {
        slug,
        title: titleMatch ? titleMatch[1].trim() : slug,
        date: "",
        background: bgMatch ? bgMatch[1].trim() : "",
        tags: [],
        categories: [],
        intro: "",
        content
    };
}
