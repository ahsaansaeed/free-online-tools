"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import imageCompression from "browser-image-compression";
import { Upload, Download, Trash2, ImageIcon, CheckCircle } from "lucide-react";

const faq = [
  {
    question: "How much can images be compressed?",
    answer: "Typically 40–80% size reduction depending on the image. The compression algorithm preserves visual quality while significantly reducing file size.",
  },
  {
    question: "What image formats are supported?",
    answer: "JPG/JPEG, PNG, WebP, GIF, and BMP images are supported. The output format matches your input format.",
  },
  {
    question: "Is there a file size limit?",
    answer: "You can compress images up to 50MB. For best performance, we recommend images under 20MB.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer: "No. All compression happens directly in your browser using WebAssembly technology. Your images never leave your device.",
  },
];

interface CompressedFile {
  original: File;
  compressed: File;
  originalSize: number;
  compressedSize: number;
  savings: number;
  url: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function ImageCompressorClient() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback(
    async (inputFiles: FileList | null) => {
      if (!inputFiles || inputFiles.length === 0) return;

      setProcessing(true);
      const newFiles: CompressedFile[] = [];

      for (let i = 0; i < inputFiles.length; i++) {
        const file = inputFiles[i];
        if (!file.type.startsWith("image/")) continue;

        try {
          const compressed = await imageCompression(file, {
            maxSizeMB: file.size / (1024 * 1024) * quality,
            maxWidthOrHeight: maxWidth,
            useWebWorker: true,
            initialQuality: quality,
          });

          const url = URL.createObjectURL(compressed);
          const savings = ((1 - compressed.size / file.size) * 100);

          newFiles.push({
            original: file,
            compressed,
            originalSize: file.size,
            compressedSize: compressed.size,
            savings: Math.max(0, savings),
            url,
          });
        } catch (err) {
          console.error("Compression failed for", file.name, err);
        }
      }

      setFiles((prev) => [...prev, ...newFiles]);
      setProcessing(false);
    },
    [quality, maxWidth]
  );

  const handleDownload = (item: CompressedFile) => {
    const link = document.createElement("a");
    link.href = item.url;
    link.download = `compressed-${item.original.name}`;
    link.click();
  };

  const handleDownloadAll = () => {
    files.forEach((f) => handleDownload(f));
  };

  const clearAll = () => {
    files.forEach((f) => URL.revokeObjectURL(f.url));
    setFiles([]);
  };

  const totalOriginal = files.reduce((a, f) => a + f.originalSize, 0);
  const totalCompressed = files.reduce((a, f) => a + f.compressedSize, 0);
  const totalSavings = totalOriginal > 0 ? ((1 - totalCompressed / totalOriginal) * 100) : 0;

  return (
    <ToolLayout toolId="image-compressor" faq={faq}>
      <div className="space-y-6">
        {/* Settings */}
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-[var(--muted)] mb-2 block">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
                <span>Smaller file</span>
                <span>Higher quality</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] mb-2 block">
                Max Width: {maxWidth}px
              </label>
              <input
                type="range"
                min={320}
                max={3840}
                step={10}
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
                <span>320px</span>
                <span>3840px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <label
          className={`drop-zone rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            id="image-compressor-input"
          />
          <Upload className="w-10 h-10 text-[var(--muted)] mb-4" />
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            {processing ? "Compressing..." : "Drop images here or click to browse"}
          </p>
          <p className="text-xs text-[var(--muted)]">Supports JPG, PNG, WebP · Max 50MB</p>
        </label>

        {/* Results */}
        {files.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="glass rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-xs text-[var(--muted)]">Original</p>
                  <p className="text-lg font-bold text-[var(--foreground)]">{formatSize(totalOriginal)}</p>
                </div>
                <span className="text-[var(--muted)]">→</span>
                <div>
                  <p className="text-xs text-[var(--muted)]">Compressed</p>
                  <p className="text-lg font-bold text-[var(--success)]">{formatSize(totalCompressed)}</p>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "var(--success-glow)", color: "var(--success)" }}>
                  -{totalSavings.toFixed(1)}%
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleDownloadAll} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download All
                </button>
                <button onClick={clearAll} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-2">
              {files.map((item, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(108,92,231,0.1)] flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{item.original.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatSize(item.originalSize)} → {formatSize(item.compressedSize)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-[var(--success)] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      -{item.savings.toFixed(0)}%
                    </span>
                    <button
                      onClick={() => handleDownload(item)}
                      className="text-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
