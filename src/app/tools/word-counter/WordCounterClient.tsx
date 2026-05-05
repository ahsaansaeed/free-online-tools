"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Hash, Clock, FileText, AlignLeft, Copy, Trash2 } from "lucide-react";

const faq = [
  {
    question: "How does the word counter work?",
    answer:
      "Our word counter analyzes your text in real-time directly in your browser. It counts words, characters (with and without spaces), sentences, paragraphs, and estimates reading time — all without uploading your text anywhere.",
  },
  {
    question: "Is this word counter free?",
    answer:
      "Yes, 100% free with no limits. Count as many words as you want, as many times as you need.",
  },
  {
    question: "How is reading time calculated?",
    answer:
      "Reading time is estimated based on an average reading speed of 200 words per minute, which is the standard used by most publications.",
  },
  {
    question: "Is my text private?",
    answer:
      "Absolutely. Your text never leaves your browser. All processing happens locally on your device.",
  },
];

export default function WordCounterClient() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = trimmed ? (trimmed.match(/[.!?]+/g) || []).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length || (trimmed.length > 0 ? 1 : 0) : 0;
    const readingTime = Math.ceil(words / 200);

    return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout toolId="word-counter" faq={faq}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2">
          <div className="glass rounded-2xl p-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start typing or paste your text here..."
              className="w-full h-[400px] bg-transparent text-[var(--foreground)] placeholder-[var(--muted)] resize-none p-5 rounded-xl outline-none text-sm leading-relaxed font-[inherit]"
              id="word-counter-input"
              autoFocus
            />
            <div className="flex items-center justify-between px-5 pb-3">
              <span className="text-xs text-[var(--muted)]">
                {stats.words} words · {stats.characters} characters
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-30"
                  title="Copy text"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
                <button
                  onClick={() => setText("")}
                  disabled={!text}
                  className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--danger)] transition-colors disabled:opacity-30"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          {[
            { icon: Hash, label: "Words", value: stats.words.toLocaleString(), color: "var(--accent)" },
            { icon: FileText, label: "Characters", value: stats.characters.toLocaleString(), sub: `${stats.charactersNoSpaces.toLocaleString()} without spaces`, color: "var(--success)" },
            { icon: AlignLeft, label: "Sentences", value: stats.sentences.toLocaleString(), color: "var(--warning)" },
            { icon: AlignLeft, label: "Paragraphs", value: stats.paragraphs.toLocaleString(), color: "var(--danger)" },
            { icon: Clock, label: "Reading Time", value: `${stats.readingTime} min`, sub: "~200 words/min", color: "var(--accent-light)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-bold text-[var(--foreground)]">{stat.value}</p>
                {stat.sub && <p className="text-[10px] text-[var(--muted)]">{stat.sub}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
