import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getAllPosts } from "./lib/api";
import CommandMenu from "./components/CommandMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How2Code - Developer Reference",
  description: "Ultimate developer cheat sheets and reference guides.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const posts = getAllPosts();
  const menuItems = posts.map(p => ({ title: p.title, slug: p.slug }));

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CommandMenu items={menuItems} />
        {children}
      </body>
    </html>
  );
}
