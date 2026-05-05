import { notFound } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog";
import { ArrowLeft, Calendar, User, Clock } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import AdSlot from "@/components/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} — ToolBox Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Link */}
      <nav className="mb-8 animate-fade-in">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent-light)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </nav>

      {/* Header */}
      <header className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--foreground)] mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--muted-light)]">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--accent)]" /> {post.date}
          </span>
          <span className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--success)]" /> {post.author}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--warning)]" /> {post.readTime}
          </span>
        </div>
      </header>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden mb-12 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto aspect-video object-cover"
        />
      </div>

      {/* Top Ad */}
      <AdSlot slotId="blog-post-top" className="mb-12 animate-fade-in" style={{ animationDelay: "0.15s" }} />

      {/* Content */}
      <div 
        className="prose max-w-none animate-fade-in-up" 
        style={{ animationDelay: "0.2s" }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Bottom Ad */}
      <AdSlot slotId="blog-post-bottom" className="mt-16 animate-fade-in" style={{ animationDelay: "0.3s" }} />
    </article>
  );
}
