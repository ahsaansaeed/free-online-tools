"use client";

import { useState, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { marked } from "marked";
import { Copy, FileCode, CheckCircle, Eye, Code, Trash2 } from "lucide-react";

const faq = [
  {
    question: "What is Markdown?",
    answer: "Markdown is a lightweight markup language with plain-text formatting syntax. It is designed so that it can be converted to HTML and many other formats.",
  },
  {
    question: "Is this converter private?",
    answer: "Yes! All processing happens directly in your browser. Your text never leaves your device.",
  },
  {
    question: "Can I use GitHub Flavored Markdown (GFM)?",
    answer: "Yes, our converter supports standard Markdown as well as many GFM features like tables and task lists.",
  },
];

export default function MarkdownClient() {
  const [markdown, setMarkdown] = useState("# Hello World\n\nThis is a **Markdown** preview.\n\n- List item 1\n- List item 2\n\n```javascript\nconsole.log('Hello!');\n```");
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const parseMarkdown = async () => {
      const parsed = await marked.parse(markdown);
      setHtml(parsed);
    };
    parseMarkdown();
  }, [markdown]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clear = () => {
    setMarkdown("");
    setHtml("");
  };

  return (
    <ToolLayout toolId="markdown-to-html" faq={faq}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-400px)] min-h-[600px]">
        {/* Editor */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[var(--accent)]" /> Markdown Input
            </label>
            <button
              onClick={clear}
              className="p-2 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 glass rounded-2xl overflow-hidden relative border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Type or paste Markdown here..."
              className="w-full h-full bg-transparent p-6 text-[var(--foreground)] font-mono text-sm focus:outline-none resize-none placeholder-[var(--muted)]"
              spellCheck="false"
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)]">
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "preview"
                    ? "bg-[var(--accent)] text-white shadow-md"
                    : "text-[var(--muted-light)] hover:text-[var(--foreground)]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                  activeTab === "code"
                    ? "bg-[var(--accent)] text-white shadow-md"
                    : "text-[var(--muted-light)] hover:text-[var(--foreground)]"
                }`}
              >
                <Code className="w-3.5 h-3.5" /> HTML Code
              </button>
            </div>
            
            <button
              onClick={copyToClipboard}
              disabled={!html}
              className={`flex items-center gap-2 text-xs font-bold transition-all px-4 py-2 rounded-xl ${
                copied 
                ? "text-[var(--success)] bg-[var(--success)]/10" 
                : "text-[var(--accent)] hover:bg-[var(--accent)]/10"
              }`}
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy HTML"}
            </button>
          </div>

          <div className="flex-1 glass rounded-2xl overflow-hidden relative border border-[var(--border)] bg-[#0d0e1b]/50">
            {activeTab === "preview" ? (
              <div 
                className="w-full h-full p-8 overflow-auto prose prose-invert max-w-none custom-scrollbar"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <pre className="w-full h-full p-6 text-[var(--foreground)] font-mono text-sm overflow-auto custom-scrollbar">
                <code className="language-html">{html}</code>
              </pre>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
