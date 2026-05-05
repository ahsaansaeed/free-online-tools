"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, Trash2, FileImage, Settings, Check } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";

// Use CDN for worker to avoid complex webpack config in Next.js
if (typeof window !== "undefined" && "pdfjsWorker" in window === false) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

const faq = [
  {
    question: "How does the PDF to Image conversion work?",
    answer: "We use Mozilla's PDF.js library to render each page of your PDF file directly inside your browser, and then we export those rendered pages as high-quality image files.",
  },
  {
    question: "Is there a limit on the number of pages?",
    answer: "We can process PDFs of any length, but converting hundreds of pages at extremely high resolution might use a lot of your computer's memory.",
  },
  {
    question: "Are my files kept private?",
    answer: "Yes, 100%. The conversion happens locally on your device. We do not upload your PDF documents anywhere.",
  },
];

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
}

export default function PDFToImageClient() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");
  const [scale, setScale] = useState<number>(2); // 2x scale for better quality
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [pages, setPages] = useState<ConvertedPage[]>([]);

  const handleFile = (inputFile: File) => {
    if (inputFile.type !== "application/pdf") return;
    setFile(inputFile);
    setPages([]);
    setProgress({ current: 0, total: 0 });
  };

  const convertPDF = async () => {
    if (!file) return;
    setConverting(true);
    setPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const totalPages = pdf.numPages;
      setProgress({ current: 0, total: totalPages });
      
      const newPages: ConvertedPage[] = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        if (!ctx) continue;
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        
        await page.render(renderContext).promise;
        
        // If JPEG, we should add a white background since PDF might be transparent
        if (format === "image/jpeg") {
          const newCanvas = document.createElement("canvas");
          newCanvas.width = canvas.width;
          newCanvas.height = canvas.height;
          const newCtx = newCanvas.getContext("2d");
          if (newCtx) {
            newCtx.fillStyle = "#ffffff";
            newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
            newCtx.drawImage(canvas, 0, 0);
            newPages.push({
              pageNumber: i,
              dataUrl: newCanvas.toDataURL(format, 0.9), // 0.9 quality for JPEG
            });
            continue;
          }
        }
        
        newPages.push({
          pageNumber: i,
          dataUrl: canvas.toDataURL(format),
        });
        
        setProgress({ current: i, total: totalPages });
      }

      setPages(newPages);
    } catch (err) {
      console.error("PDF Conversion failed:", err);
      alert("Failed to convert PDF. It might be corrupted or password protected.");
    } finally {
      setConverting(false);
    }
  };

  const clear = () => {
    setFile(null);
    setPages([]);
    setProgress({ current: 0, total: 0 });
  };

  const downloadAll = () => {
    // Basic approach: trigger multiple downloads
    // A better approach would be JSZip, but keeping it simple for now
    pages.forEach((page, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = page.dataUrl;
        const ext = format === "image/png" ? "png" : "jpg";
        link.download = `${file?.name.replace(".pdf", "")}_page-${page.pageNumber}.${ext}`;
        link.click();
      }, index * 200); // Slight delay to prevent browser blocking multiple downloads
    });
  };

  const downloadSingle = (page: ConvertedPage) => {
    const link = document.createElement("a");
    link.href = page.dataUrl;
    const ext = format === "image/png" ? "png" : "jpg";
    link.download = `${file?.name.replace(".pdf", "")}_page-${page.pageNumber}.${ext}`;
    link.click();
  };

  return (
    <ToolLayout toolId="pdf-to-image" faq={faq}>
      <div className="space-y-8">
        {!file ? (
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
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
              }}
            />
            <FileImage className="w-12 h-12 text-[var(--muted)] mb-4" />
            <p className="text-lg font-medium text-[var(--foreground)] mb-2">
              Drop a PDF file here to convert
            </p>
            <p className="text-sm text-[var(--muted-light)]">Or click to browse</p>
          </label>
        ) : (
          <div className="space-y-8">
            
            {/* Control Panel */}
            <div className="glass rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[var(--foreground)] truncate max-w-[300px]" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-sm text-[var(--muted)]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
                <div className="flex gap-4 p-4 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-[var(--muted)] font-semibold flex items-center gap-1">
                      <Settings className="w-3 h-3" /> Format
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value as any)}
                      className="bg-transparent text-sm text-[var(--foreground)] focus:outline-none cursor-pointer"
                      disabled={converting || pages.length > 0}
                    >
                      <option value="image/png">PNG</option>
                      <option value="image/jpeg">JPG</option>
                    </select>
                  </div>
                  <div className="w-px h-full bg-[var(--border)]" />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-[var(--muted)] font-semibold flex items-center gap-1">
                      <Settings className="w-3 h-3" /> Quality
                    </label>
                    <select
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="bg-transparent text-sm text-[var(--foreground)] focus:outline-none cursor-pointer"
                      disabled={converting || pages.length > 0}
                    >
                      <option value={1}>Standard (1x)</option>
                      <option value={2}>High (2x)</option>
                      <option value={3}>Maximum (3x)</option>
                    </select>
                  </div>
                </div>

                {pages.length === 0 ? (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={convertPDF}
                      disabled={converting}
                      className="btn-primary py-3 px-6 text-sm flex-1 sm:flex-none"
                    >
                      {converting ? `Converting (${progress.current}/${progress.total})...` : "Convert to Images"}
                    </button>
                    <button
                      onClick={clear}
                      disabled={converting}
                      className="btn-secondary py-3 px-4 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={downloadAll}
                      className="btn-primary py-3 px-6 text-sm flex-1 sm:flex-none flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #00cec9, #00b894)" }}
                    >
                      <Download className="w-4 h-4" /> Download All ({pages.length})
                    </button>
                    <button
                      onClick={clear}
                      className="btn-secondary py-3 px-4 flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Results Grid */}
            {pages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                {pages.map((page) => (
                  <div key={page.pageNumber} className="glass rounded-xl overflow-hidden flex flex-col group relative">
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm z-10">
                      Page {page.pageNumber}
                    </div>
                    <div className="aspect-[1/1.4] bg-white relative flex items-center justify-center overflow-hidden">
                      <img
                        src={page.dataUrl}
                        alt={`Page ${page.pageNumber}`}
                        className="max-w-full max-h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => downloadSingle(page)}
                          className="bg-white text-black font-semibold text-sm py-2 px-4 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl hover:bg-[var(--accent)] hover:text-white"
                        >
                          <Download className="w-4 h-4" /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {converting && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[var(--foreground)] font-semibold">Processing PDF...</p>
                <p className="text-[var(--muted)] text-sm mt-1">Page {progress.current} of {progress.total}</p>
              </div>
            )}

          </div>
        )}
      </div>
    </ToolLayout>
  );
}
