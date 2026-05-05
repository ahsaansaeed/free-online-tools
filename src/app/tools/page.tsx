import Link from "next/link";
import { tools } from "@/lib/tools";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Free Tools — ToolBox",
  description:
    "Browse all free online tools: image compressor, PDF merger, QR code generator, word counter, and more. 100% free, 100% private.",
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] animate-fade-in-up">
          All Free Tools
        </h1>
        <p className="text-[var(--muted-light)] mt-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {tools.length} tools available — all free, all private, all browser-based.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="tool-card glass rounded-2xl p-6 block animate-fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}
              >
                <Icon className="w-6 h-6" style={{ color: tool.color }} />
              </div>
              <h2 className="text-base font-semibold text-[var(--foreground)] mb-1.5">
                {tool.name}
              </h2>
              <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">
                {tool.shortDescription}
              </p>
              <span
                className="inline-flex items-center gap-1 text-xs font-medium"
                style={{ color: tool.color }}
              >
                Use Tool <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
