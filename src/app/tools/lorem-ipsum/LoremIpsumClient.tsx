"use client";

import { useState, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, RefreshCw, CheckCircle, FileText, Settings } from "lucide-react";

const faq = [
  {
    question: "What is Lorem Ipsum?",
    answer: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has been the industry's standard dummy text ever since the 1500s.",
  },
  {
    question: "Why do we use it?",
    answer: "It is used because it has a more-or-less normal distribution of letters, making it look like readable English for design previews.",
  },
  {
    question: "Can I customize the amount of text?",
    answer: "Yes! You can choose the number of paragraphs, sentences, or words you want to generate.",
  },
];

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export default function LoremIpsumClient() {
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [generatedText, setGeneratedText] = useState("");
  const [copied, setCopied] = useState(false);

  const generateText = useCallback(() => {
    let result = "";
    
    if (type === "words") {
      const words = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      result = words.join(" ");
    } else if (type === "sentences") {
      const sentences = [];
      for (let i = 0; i < count; i++) {
        const wordCount = Math.floor(Math.random() * 10) + 5;
        const sentence = [];
        for (let j = 0; j < wordCount; j++) {
          sentence.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
        let str = sentence.join(" ");
        sentences.push(str.charAt(0).toUpperCase() + str.slice(1) + ".");
      }
      result = sentences.join(" ");
    } else {
      const paragraphs = [];
      for (let i = 0; i < count; i++) {
        const sentenceCount = Math.floor(Math.random() * 4) + 3;
        const sentences = [];
        for (let j = 0; j < sentenceCount; j++) {
          const wordCount = Math.floor(Math.random() * 12) + 8;
          const sentence = [];
          for (let k = 0; k < wordCount; k++) {
            sentence.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
          }
          let str = sentence.join(" ");
          sentences.push(str.charAt(0).toUpperCase() + str.slice(1) + ".");
        }
        paragraphs.push(sentences.join(" "));
      }
      result = paragraphs.join("\n\n");
    }
    
    setGeneratedText(result);
  }, [type, count]);

  useEffect(() => {
    generateText();
  }, [generateText]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <ToolLayout toolId="lorem-ipsum" faq={faq}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="glass rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-3 h-3" /> Type
              </label>
              <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)]">
                {(["paragraphs", "sentences", "words"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      type === t
                        ? "bg-[var(--accent)] text-white shadow-md"
                        : "text-[var(--muted-light)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider">
                Count
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-2 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateText}
              className="btn-secondary px-6 py-3 text-sm flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
            <button
              onClick={copyToClipboard}
              className="btn-primary px-6 py-3 text-sm flex items-center gap-2 shadow-lg shadow-[var(--accent)]/20"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="relative group">
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
             <button
              onClick={copyToClipboard}
              className="p-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--muted)] hover:text-[var(--accent)] transition-colors shadow-sm"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="glass rounded-2xl p-8 min-h-[400px]">
            <div className="flex items-center gap-2 mb-6 text-[var(--muted)]">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-widest">Generated Content</span>
            </div>
            <div className="prose prose-invert max-w-none">
              {generatedText.split("\n\n").map((para, i) => (
                <p key={i} className="text-[var(--foreground)] opacity-90 leading-relaxed mb-6 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
