import Link from "next/link";
import { posts } from "@/lib/blog";
import { ArrowRight, Calendar, User } from "lucide-react";
import type { Metadata } from "next";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "Blog — ToolBox",
  description:
    "Read the latest tips, tricks, and guides on how to use free online tools for better productivity.",
};

export default function BlogPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] animate-fade-in-up">
          ToolBox <span className="gradient-text">Blog</span>
        </h1>
        <p className="text-[var(--muted-light)] mt-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          Guides, tips, and insights on using free online tools to boost your productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, i) => (
          <article
            key={post.slug}
            className="tool-card glass rounded-2xl overflow-hidden flex flex-col animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center gap-4 text-xs text-[var(--muted)] mb-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {post.author}
                </span>
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-[var(--foreground)] hover:text-[var(--accent-light)] transition-colors mb-3">
                  {post.title}
                </h2>
              </Link>
              <p className="text-sm text-[var(--muted-light)] mb-5 flex-1 line-clamp-3">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
              >
                Read Article <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <AdSlot slotId="blog-index-bottom" className="mt-12" />
    </div>
  );
}
