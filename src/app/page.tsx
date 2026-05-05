import Link from "next/link";
import { tools } from "@/lib/tools";
import { Shield, Zap, Heart, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full mb-6 animate-fade-in bg-[rgba(108,92,231,0.08)] border border-[rgba(108,92,231,0.15)] text-[var(--accent-light)]">
              <Sparkles className="w-3.5 h-3.5" />
              100% Free · No Sign-up · Privacy First
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight animate-fade-in-up">
              Free Online Tools That{" "}
              <span className="gradient-text">Respect Your Privacy</span>
            </h1>

            <p className="text-lg text-[var(--muted-light)] mt-6 max-w-2xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
              Convert, compress, and create with powerful browser-based tools.
              Your files never leave your device — everything runs locally.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link href="/tools" className="btn-primary inline-flex items-center gap-2">
                Explore All Tools
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#how-it-works" className="btn-secondary inline-flex items-center gap-2">
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              {
                icon: Shield,
                title: "Privacy First",
                desc: "Files processed locally — never uploaded",
                color: "var(--success)",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "No server round-trips — instant results",
                color: "var(--warning)",
              },
              {
                icon: Heart,
                title: "Free Forever",
                desc: "No limits, no subscriptions, no catches",
                color: "var(--danger)",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-center gap-3 py-2">
                <item.icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{item.title}</p>
                  <p className="text-xs text-[var(--muted)]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Powerful Tools, <span className="gradient-text">Zero Cost</span>
          </h2>
          <p className="text-[var(--muted-light)] mt-3 max-w-xl mx-auto">
            Every tool runs entirely in your browser. No uploads, no accounts, no limits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="tool-card glass rounded-2xl p-6 block"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: tool.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-[var(--foreground)]">
                        {tool.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-[var(--muted)] bg-[var(--card-hover)] px-2 py-0.5 rounded-full">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--muted)] mt-1.5 leading-relaxed">
                      {tool.shortDescription}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-medium mt-3 transition-colors" style={{ color: tool.color }}>
                      Use Tool
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Coming Soon Card */}
          <div className="glass rounded-2xl p-6 flex items-center justify-center border-dashed border-2 border-[var(--border)] opacity-60">
            <div className="text-center">
              <p className="text-sm font-semibold text-[var(--muted-light)]">More Tools Coming</p>
              <p className="text-xs text-[var(--muted)] mt-1">10+ tools in development</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="border-t border-[var(--border)] bg-[var(--card)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              How It Works
            </h2>
            <p className="text-[var(--muted-light)] mt-3">Three simple steps. No accounts needed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose a Tool",
                desc: "Pick from our growing collection of free online tools.",
                color: "var(--accent)",
              },
              {
                step: "02",
                title: "Upload or Paste",
                desc: "Drag & drop files or paste text. Everything stays in your browser.",
                color: "var(--success)",
              },
              {
                step: "03",
                title: "Download Result",
                desc: "Get your processed file instantly. No waiting, no email required.",
                color: "var(--warning)",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 text-lg font-bold"
                  style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}25` }}
                >
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted)] max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="glass rounded-3xl p-10 sm:p-14 text-center animate-pulse-glow">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Ready to Get Started?
          </h2>
          <p className="text-[var(--muted-light)] mt-3 max-w-lg mx-auto">
            No sign-up. No credit card. Just pick a tool and go.
          </p>
          <Link href="/tools" className="btn-primary inline-flex items-center gap-2 mt-8">
            Browse All Tools
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
