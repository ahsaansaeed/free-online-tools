"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, Trash2, ImageIcon, ArrowRightLeft, CheckCircle } from "lucide-react";

const faq = [
  {
    question: "What image formats can I convert between?",
    answer: "You can convert between JPG (JPEG), PNG, and WebP formats. Simply upload your images and select the desired output format.",
  },
  {
    question: "Is there a file size or batch limit?",
    answer: "You can convert images up to 50MB each, and there is no limit on the number of images you can convert in one batch.",
  },
  {
    question: "Will conversion affect image quality?",
    answer: "We use high-quality conversion settings. PNG and WebP produce lossless or near-lossless results. JPG uses 92% quality by default.",
  },
  {
    question: "Are my images uploaded anywhere?",
    answer: "No. All conversion happens in your browser using the Canvas API. Your images stay on your device at all times.",
  },
];

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

const formatOptions: { label: string; value: OutputFormat; ext: string }[] = [
  { label: "PNG", value: "image/png", ext: "png" },
  { label: "JPG", value: "image/jpeg", ext: "jpg" },
  { label: "WebP", value: "image/webp", ext: "webp" },
];

interface ConvertedFile {
  originalName: string;
  originalSize: number;
  convertedSize: number;
  url: string;
  ext: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function convertImage(file: File, format: OutputFormat, quality: number): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas not supported");

      // White background for JPG (no transparency)
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Conversion failed");
          resolve({ blob, url: URL.createObjectURL(blob) });
        },
        format,
        quality
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageConverterClient() {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/png");
  const [quality, setQuality] = useState(0.92);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const selectedFormat = formatOptions.find((f) => f.value === outputFormat)!;

  const handleFiles = useCallback(
    async (inputFiles: FileList | null) => {
      if (!inputFiles || inputFiles.length === 0) return;
      setConverting(true);

      const results: ConvertedFile[] = [];

      for (let i = 0; i < inputFiles.length; i++) {
        const file = inputFiles[i];
        if (!file.type.startsWith("image/")) continue;

        try {
          const { blob, url } = await convertImage(file, outputFormat, quality);
          results.push({
            originalName: file.name,
            originalSize: file.size,
            convertedSize: blob.size,
            url,
            ext: selectedFormat.ext,
          });
        } catch (err) {
          console.error("Conversion failed:", file.name, err);
        }
      }

      setConvertedFiles((prev) => [...prev, ...results]);
      setConverting(false);
    },
    [outputFormat, quality, selectedFormat.ext]
  );

  const handleDownload = (item: ConvertedFile) => {
    const link = document.createElement("a");
    link.href = item.url;
    const baseName = item.originalName.replace(/\.[^.]+$/, "");
    link.download = `${baseName}.${item.ext}`;
    link.click();
  };

  const handleDownloadAll = () => {
    convertedFiles.forEach((f) => handleDownload(f));
  };

  const clearAll = () => {
    convertedFiles.forEach((f) => URL.revokeObjectURL(f.url));
    setConvertedFiles([]);
  };

  return (
    <ToolLayout toolId="image-converter" faq={faq}>
      <div className="space-y-6">
        {/* Format Selection */}
        <div className="glass rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-[var(--muted)] mb-3 block">Convert to:</label>
              <div className="flex gap-2">
                {formatOptions.map((fmt) => (
                  <button
                    key={fmt.value}
                    onClick={() => setOutputFormat(fmt.value)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      outputFormat === fmt.value
                        ? "bg-[var(--accent)] text-white"
                        : "glass text-[var(--muted-light)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
            {outputFormat !== "image/png" && (
              <div>
                <label className="text-xs text-[var(--muted)] mb-3 block">
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.01}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-[var(--accent)]"
                />
              </div>
            )}
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
            id="image-converter-input"
          />
          <ArrowRightLeft className="w-10 h-10 text-[var(--muted)] mb-4" />
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            {converting ? "Converting..." : `Drop images to convert to ${selectedFormat.label}`}
          </p>
          <p className="text-xs text-[var(--muted)]">Supports JPG, PNG, WebP, BMP, GIF</p>
        </label>

        {/* Results */}
        {convertedFiles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-[var(--muted)]">{convertedFiles.length} images converted</p>
              <div className="flex gap-2">
                <button onClick={handleDownloadAll} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download All
                </button>
                <button onClick={clearAll} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {convertedFiles.map((item, i) => (
                <div key={i} className="glass rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[rgba(162,155,254,0.1)] flex items-center justify-center shrink-0">
                    <ImageIcon className="w-5 h-5 text-[#a29bfe]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">
                      {item.originalName.replace(/\.[^.]+$/, "")}.{item.ext}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatSize(item.originalSize)} → {formatSize(item.convertedSize)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold text-[var(--success)] flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Done
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
