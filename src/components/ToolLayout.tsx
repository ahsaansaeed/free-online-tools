import Link from "next/link";
import { ArrowLeft, Shield, Zap, Globe } from "lucide-react";
import { tools } from "@/lib/tools";
import AdSlot from "@/components/AdSlot";

interface ToolLayoutProps {
  toolId: string;
  children: React.ReactNode;
  faq?: { question: string; answer: string }[];
}

export default function ToolLayout({ toolId, children, faq }: ToolLayoutProps) {
  const tool = tools.find((t) => t.id === toolId);
  const relatedTools = tools.filter((t) => t.id !== toolId).slice(0, 3);

  if (!tool) return null;

  const Icon = tool.icon;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted)] mb-6 animate-fade-in">
        <Link href="/" className="hover:text-[var(--accent-light)] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-[var(--accent-light)] transition-colors">
          Tools
        </Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8 animate-fade-in-up">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: `${tool.color}20`, border: `1px solid ${tool.color}30` }}
        >
          <Icon className="w-7 h-7" style={{ color: tool.color }} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Free {tool.name} Online
          </h1>
          <p className="text-[var(--muted-light)] mt-1 max-w-2xl">{tool.description}</p>
        </div>
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-3 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        {[
          { icon: Shield, text: "Files never uploaded", color: "var(--success)" },
          { icon: Zap, text: "Instant processing", color: "var(--warning)" },
          { icon: Globe, text: "100% free", color: "var(--accent-light)" },
        ].map((badge) => (
          <div
            key={badge.text}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{
              background: `${badge.color}10`,
              border: `1px solid ${badge.color}20`,
              color: badge.color,
            }}
          >
            <badge.icon className="w-3 h-3" />
            {badge.text}
          </div>
        ))}
      </div>

      {/* Top Ad Slot */}
      <AdSlot slotId="top-banner" />

      {/* Tool content */}
      <div className="animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        {children}
      </div>

      {/* Middle Ad Slot */}
      <AdSlot slotId="middle-banner" className="mt-8" />

      {/* FAQ Section */}
      {faq && faq.length > 0 && (
        <section className="mt-16 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details
                key={i}
                className="group glass rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors">
                  {item.question}
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform text-lg">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-4 text-sm text-[var(--muted-light)] leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Tools */}
      <section className="mt-16 animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Related Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedTools.map((t) => {
            const RelIcon = t.icon;
            return (
              <Link
                key={t.id}
                href={t.href}
                className="tool-card glass rounded-xl p-5 block"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${t.color}20` }}
                >
                  <RelIcon className="w-5 h-5" style={{ color: t.color }} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">{t.name}</h3>
                <p className="text-xs text-[var(--muted)]">{t.shortDescription}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Back to tools */}
      <div className="mt-10">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent-light)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all tools
        </Link>
      </div>
    </div>
  );
}
