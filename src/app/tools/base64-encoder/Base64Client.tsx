"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Copy, Trash2, ArrowRightLeft, FileUp, CheckCircle, AlertCircle } from "lucide-react";

const faq = [
  {
    question: "What is Base64 encoding?",
    answer: "Base64 is a way to represent binary data in an ASCII string format. It is commonly used to embed images directly into HTML/CSS files, or to safely transmit data across networks.",
  },
  {
    question: "Can I convert images to Base64?",
    answer: "Yes! Use the file upload tab to select an image, PDF, or any other file. We will instantly encode it into a Base64 data URI that you can paste into your code.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Because processing happens in your browser's memory, very large files (e.g., over 50MB) might slow down or crash the tab. For standard images and documents, it works perfectly.",
  },
];

type Mode = "encode" | "decode";
type InputType = "text" | "file";

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>("encode");
  const [inputType, setInputType] = useState<InputType>("text");
  
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleTextChange = (text: string) => {
    setInput(text);
    setError(null);
    if (!text) {
      setOutput("");
      return;
    }

    try {
      if (mode === "encode") {
        // Encode text
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        // Decode text
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch (err) {
      setError(`Invalid ${mode === "encode" ? "text" : "Base64 string"}`);
      setOutput("");
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setError(null);
    const reader = new FileReader();
    
    if (mode === "encode") {
      reader.onload = () => {
        setOutput(reader.result as string);
      };
      reader.onerror = () => setError("Failed to read file");
      reader.readAsDataURL(file);
    } else {
      // Decode file is less common in this context, usually decoding back to string or downloading.
      // We will restrict file input to 'encode' mode only for simplicity in MVP.
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
    setFileName(null);
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    if (inputType === "file" && newMode === "decode") {
      setInputType("text"); // Force text input for decoding
    }
    clear();
  };

  return (
    <ToolLayout toolId="base64-encoder" faq={faq}>
      <div className="space-y-6">
        
        {/* Top Controls */}
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex bg-[var(--card)] p-1 rounded-xl border border-[var(--border)]">
            <button
              onClick={toggleMode}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "encode" ? "bg-[var(--accent)] text-white shadow-md" : "text-[var(--muted-light)] hover:text-[var(--foreground)]"
              }`}
            >
              Encode
            </button>
            <button
              onClick={toggleMode}
              className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                mode === "decode" ? "bg-[var(--success)] text-white shadow-md" : "text-[var(--muted-light)] hover:text-[var(--foreground)]"
              }`}
            >
              Decode
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clear}
              className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-[rgba(255,107,107,0.1)] border border-[var(--danger)] rounded-xl p-4 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-[var(--danger)] shrink-0" />
            <p className="text-sm font-semibold text-[var(--danger)]">{error}</p>
          </div>
        )}

        {/* Input/Output Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Input Side */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-[var(--foreground)]">
                Input {mode === "encode" ? "(Text or File)" : "(Base64 String)"}
              </label>
              
              {mode === "encode" && (
                <div className="flex text-xs bg-[var(--card)] rounded-md border border-[var(--border)] overflow-hidden">
                  <button
                    onClick={() => setInputType("text")}
                    className={`px-3 py-1.5 ${inputType === "text" ? "bg-[var(--accent-light)]/20 text-[var(--accent-light)] font-bold" : "text-[var(--muted)]"}`}
                  >
                    Text
                  </button>
                  <button
                    onClick={() => setInputType("file")}
                    className={`px-3 py-1.5 ${inputType === "file" ? "bg-[var(--accent-light)]/20 text-[var(--accent-light)] font-bold" : "text-[var(--muted)]"}`}
                  >
                    File
                  </button>
                </div>
              )}
            </div>

            {inputType === "text" ? (
              <textarea
                value={input}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={`Paste your ${mode === "encode" ? "text" : "Base64 string"} here...`}
                className="w-full h-[400px] bg-[#0d0e1b] border border-[var(--border)] rounded-2xl p-6 text-[var(--foreground)] font-mono text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none placeholder-[var(--muted)]"
                spellCheck="false"
              />
            ) : (
              <label className="flex-1 w-full min-h-[400px] drop-zone rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
                  }}
                />
                <FileUp className="w-12 h-12 text-[var(--muted)] mb-4" />
                <p className="text-lg font-medium text-[var(--foreground)] mb-1 text-center">
                  {fileName ? `Selected: ${fileName}` : "Click or drag file to encode"}
                </p>
                <p className="text-xs text-[var(--muted)] text-center">Converts files directly to Base64 Data URI</p>
              </label>
            )}
          </div>

          {/* Output Side */}
          <div className="flex flex-col h-full relative">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-[var(--success)]">
                Output {mode === "encode" ? "(Base64)" : "(Text)"}
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
              placeholder="Result will appear here..."
              className="w-full h-[400px] bg-[#0a0b14] border border-[var(--border)] rounded-2xl p-6 text-[var(--foreground)] font-mono text-sm focus:outline-none transition-colors resize-none placeholder-[var(--muted)] opacity-90"
              spellCheck="false"
            />
          </div>

        </div>
      </div>
    </ToolLayout>
  );
}
