"use client";

import { useState, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Copy, Check, Trash2, FileText, Languages, RefreshCcw } from "lucide-react";
import Script from "next/script";

const faq = [
  {
    question: "How does the Image to Text (OCR) tool work?",
    answer: "We use Tesseract.js, a powerful optical character recognition (OCR) engine that runs entirely in your browser. It analyzes the pixels in your image to identify letter shapes and convert them into editable text.",
  },
  {
    question: "Is it secure to upload my documents here?",
    answer: "Yes! Like all our tools, the OCR processing happens locally on your device. Your images and the extracted text are never uploaded to any server.",
  },
  {
    question: "Which languages are supported?",
    answer: "Currently, we support English, Spanish, French, German, Chinese, Hindi, Arabic, and many more. You can select your preferred language from the settings panel.",
  },
];

const languages = [
  { code: "eng", name: "English" },
  { code: "spa", name: "Spanish" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "hin", name: "Hindi" },
  { code: "ara", name: "Arabic" },
  { code: "jpn", name: "Japanese" },
  { code: "kor", name: "Korean" },
  { code: "rus", name: "Russian" },
  { code: "por", name: "Portuguese" },
  { code: "ita", name: "Italian" },
];

declare global {
  interface Window {
    Tesseract: any;
  }
}

export default function ImageToTextClient() {
  const [image, setImage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [lang, setLang] = useState("eng");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [libLoaded, setLibLoaded] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
    setResult("");
    setProgress(0);
    setStatus("");
  };

  const runOCR = async () => {
    if (!image || !window.Tesseract) return;
    setLoading(true);
    setProgress(0);
    setStatus("Initializing OCR engine...");

    try {
      const { createWorker } = window.Tesseract;
      const worker = await createWorker(lang, 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            setProgress(Math.floor(m.progress * 100));
            setStatus("Extracting text...");
          } else {
            setStatus(m.status);
          }
        },
      });

      const { data: { text } } = await worker.recognize(image);
      setResult(text);
      await worker.terminate();
    } catch (err) {
      console.error("OCR Error:", err);
      alert("Failed to extract text from image. Please try a clearer image.");
    } finally {
      setLoading(false);
      setStatus("Extraction complete");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setImage(null);
    setResult("");
    setProgress(0);
    setStatus("");
  };

  return (
    <ToolLayout toolId="image-to-text" faq={faq}>
      <Script 
        src="https://unpkg.com/tesseract.js@v5.0.5/dist/tesseract.min.js"
        onLoad={() => setLibLoaded(true)}
      />
      
      <div className="space-y-8">
        {!image ? (
          <label
            className={`drop-zone rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer min-h-[400px] ${dragOver ? "drag-over" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
              }}
            />
            <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <p className="text-xl font-bold text-[var(--foreground)] mb-2">
              Drop an image here to extract text
            </p>
            <p className="text-[var(--muted)]">Supports JPG, PNG, and WebP (Up to 10MB)</p>
          </label>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            {/* Input Side */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-4 overflow-hidden">
                <div className="aspect-video relative rounded-xl overflow-hidden bg-black/5 flex items-center justify-center">
                  <img src={image} alt="Source" className="max-w-full max-h-full object-contain" />
                  <button
                    onClick={clear}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-red-500 hover:text-white text-black p-2 rounded-full shadow-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 space-y-6">
                <div className="flex flex-col gap-4">
                  <label className="text-sm font-semibold text-[var(--muted)] flex items-center gap-2">
                    <Languages className="w-4 h-4" /> Recognition Language
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-[var(--foreground)] focus:ring-2 focus:ring-[var(--accent)] outline-none"
                    disabled={loading}
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code}>{l.name}</option>
                    ))}
                  </select>
                </div>

                {!result && (
                  <button
                    onClick={runOCR}
                    disabled={loading || !libLoaded}
                    className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <RefreshCcw className="w-5 h-5 animate-spin" />
                        {status} ({progress}%)
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Extract Text
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Output Side */}
            <div className="space-y-6">
              <div className="glass rounded-2xl p-6 h-full flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-[var(--foreground)]">Extracted Text</h3>
                  {result && (
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? "Copied!" : "Copy Text"}
                    </button>
                  )}
                </div>
                
                {result ? (
                  <textarea
                    readOnly
                    value={result}
                    className="flex-1 w-full bg-transparent border-none resize-none focus:outline-none text-[var(--foreground)] leading-relaxed"
                    placeholder="Result will appear here..."
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                    <FileText className="w-12 h-12 mb-4" />
                    <p>Select language and click "Extract Text" to begin</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay for the whole app if needed, but keeping it local */}
      </div>
    </ToolLayout>
  );
}
