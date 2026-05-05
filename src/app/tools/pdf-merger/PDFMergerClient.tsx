"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, Trash2, FileText, GripVertical, ArrowUp, ArrowDown, Merge } from "lucide-react";

const faq = [
  {
    question: "How many PDFs can I merge at once?",
    answer: "You can merge as many PDFs as you want. There is no limit on the number of files.",
  },
  {
    question: "Will merging affect the quality of my PDFs?",
    answer: "No. The merging process preserves the original quality of all pages, including text, images, and formatting.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer: "No. All processing happens entirely in your browser using the pdf-lib library. Your files never leave your device.",
  },
  {
    question: "Can I reorder pages before merging?",
    answer: "Yes! You can drag files to reorder them, or use the arrow buttons to move files up and down in the list.",
  },
];

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pages: number;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export default function PDFMergerClient() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);

  const handleFiles = useCallback(async (inputFiles: FileList | null) => {
    if (!inputFiles) return;

    const newFiles: PDFFile[] = [];

    for (let i = 0; i < inputFiles.length; i++) {
      const file = inputFiles[i];
      if (file.type !== "application/pdf") continue;

      try {
        const buffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        newFiles.push({
          id: crypto.randomUUID(),
          file,
          name: file.name,
          size: file.size,
          pages: pdf.getPageCount(),
        });
      } catch (err) {
        console.error("Failed to load PDF:", file.name, err);
      }
    }

    setPdfFiles((prev) => [...prev, ...newFiles]);
    setMergedUrl(null);
  }, []);

  const moveFile = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pdfFiles.length) return;
    const newFiles = [...pdfFiles];
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setPdfFiles(newFiles);
    setMergedUrl(null);
  };

  const removeFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedUrl(null);
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) return;
    setMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of pdfFiles) {
        const buffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setMergedUrl(url);
    } catch (err) {
      console.error("Merge failed:", err);
    }

    setMerging(false);
  };

  const handleDownload = () => {
    if (!mergedUrl) return;
    const link = document.createElement("a");
    link.href = mergedUrl;
    link.download = "merged.pdf";
    link.click();
  };

  const totalPages = pdfFiles.reduce((a, f) => a + f.pages, 0);
  const totalSize = pdfFiles.reduce((a, f) => a + f.size, 0);

  return (
    <ToolLayout toolId="pdf-merger" faq={faq}>
      <div className="space-y-6">
        {/* Drop Zone */}
        <label
          className={`drop-zone rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer ${dragOver ? "drag-over" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        >
          <input
            type="file"
            accept=".pdf"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            id="pdf-merger-input"
          />
          <Upload className="w-10 h-10 text-[var(--muted)] mb-4" />
          <p className="text-sm font-medium text-[var(--foreground)] mb-1">
            Drop PDF files here or click to browse
          </p>
          <p className="text-xs text-[var(--muted)]">Select 2 or more PDF files to merge</p>
        </label>

        {/* File List */}
        {pdfFiles.length > 0 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center justify-between px-2">
              <p className="text-sm text-[var(--muted)]">
                {pdfFiles.length} files · {totalPages} total pages · {formatSize(totalSize)}
              </p>
              <button
                onClick={() => { setPdfFiles([]); setMergedUrl(null); }}
                className="text-xs text-[var(--muted)] hover:text-[var(--danger)] transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Clear all
              </button>
            </div>

            {/* Files */}
            <div className="space-y-2">
              {pdfFiles.map((pdf, i) => (
                <div key={pdf.id} className="glass rounded-xl p-4 flex items-center gap-3">
                  <GripVertical className="w-4 h-4 text-[var(--muted)] shrink-0 cursor-grab" />
                  <div className="w-10 h-10 rounded-lg bg-[rgba(225,112,85,0.1)] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-[#e17055]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--foreground)] truncate">{pdf.name}</p>
                    <p className="text-xs text-[var(--muted)]">{pdf.pages} pages · {formatSize(pdf.size)}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveFile(i, -1)}
                      disabled={i === 0}
                      className="p-1.5 rounded-lg hover:bg-[var(--card-hover)] text-[var(--muted)] disabled:opacity-20 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(i, 1)}
                      disabled={i === pdfFiles.length - 1}
                      className="p-1.5 rounded-lg hover:bg-[var(--card-hover)] text-[var(--muted)] disabled:opacity-20 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(pdf.id)}
                      className="p-1.5 rounded-lg hover:bg-[rgba(255,107,107,0.1)] text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleMerge}
                disabled={pdfFiles.length < 2 || merging}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Merge className="w-4 h-4" />
                {merging ? "Merging..." : `Merge ${pdfFiles.length} PDFs`}
              </button>
              {mergedUrl && (
                <button
                  onClick={handleDownload}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #00cec9, #00b894)" }}
                >
                  <Download className="w-4 h-4" />
                  Download Merged PDF
                </button>
              )}
            </div>

            {mergedUrl && (
              <p className="text-xs text-[var(--success)] text-center flex items-center justify-center gap-1">
                ✓ PDFs merged successfully! Click download to save.
              </p>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
