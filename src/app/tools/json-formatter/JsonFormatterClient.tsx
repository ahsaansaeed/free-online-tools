"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Trash2, Code, FileJson, CheckCircle, AlertCircle, Play } from "lucide-react";

const faq = [
  {
    question: "Is my JSON data uploaded to your server?",
    answer: "No. The formatting and validation happen entirely in your web browser. Your data is never sent anywhere, ensuring complete privacy.",
  },
  {
    question: "What is JSON?",
    answer: "JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write, and easy for machines to parse and generate.",
  },
  {
    question: "How does the validator work?",
    answer: "We use standard browser parsers to read your text. If it does not conform to the strict JSON specification, we catch the error and highlight it for you.",
  },
];

export default function JsonFormatterClient() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState<number>(2);

  const formatJson = () => {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError(null);
    } catch (err: any) {
      setError(err.message || "Invalid JSON");
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  // Auto-format on indent change
  const handleIndentChange = (newIndent: number) => {
    setIndent(newIndent);
    if (output && !error) {
      try {
        const parsed = JSON.parse(input);
        setOutput(JSON.stringify(parsed, null, newIndent));
      } catch (err) {
        // Ignore if currently invalid
      }
    }
  };

  return (
    <ToolLayout toolId="json-formatter" faq={faq}>
      <div className="space-y-6">
        {/* Controls */}
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-[var(--muted)] font-medium">Indentation:</label>
            <div className="flex gap-1 bg-[var(--card)] p-1 rounded-lg border border-[var(--border)]">
              {[2, 4].map((spaces) => (
                <button
                  key={spaces}
                  onClick={() => handleIndentChange(spaces)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    indent === spaces
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--muted-light)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {spaces} Spaces
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={formatJson}
              className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Format & Validate
            </button>
            <button
              onClick={clear}
              className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {/* Status */}
        {error ? (
          <div className="bg-[rgba(255,107,107,0.1)] border border-[var(--danger)] rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--danger)] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-[var(--danger)] mb-1">Invalid JSON</h4>
              <p className="text-xs text-[var(--danger)] opacity-80 font-mono">{error}</p>
            </div>
          </div>
        ) : output ? (
          <div className="bg-[rgba(0,184,148,0.1)] border border-[var(--success)] rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-[var(--success)] shrink-0" />
            <h4 className="text-sm font-semibold text-[var(--success)]">Valid JSON</h4>
          </div>
        ) : null}

        {/* Input/Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="flex flex-col">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] mb-3">
              <Code className="w-4 h-4 text-[var(--accent)]" /> Input
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your unformatted JSON here..."
              className="w-full h-[500px] bg-[#0d0e1b] border border-[var(--border)] rounded-2xl p-6 text-[var(--foreground)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none placeholder-[var(--muted)]"
              spellCheck="false"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col relative">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)]">
                <FileJson className="w-4 h-4 text-[var(--success)]" /> Formatted Output
              </label>
              {output && (
                <button
                  onClick={copyToClipboard}
                  className={`text-xs flex items-center gap-1.5 transition-colors ${
                    copied ? "text-[var(--success)]" : "text-[var(--accent)] hover:text-[var(--accent-light)]"
                  }`}
                >
                  {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="w-full h-[500px] bg-[#0a0b14] border border-[var(--border)] rounded-2xl p-6 text-[var(--foreground)] font-mono text-sm focus:outline-none transition-colors resize-none placeholder-[var(--muted)] opacity-90"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
