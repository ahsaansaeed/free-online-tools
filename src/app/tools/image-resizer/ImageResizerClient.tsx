"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Download, Trash2, Image as ImageIcon, Link2, Unlink } from "lucide-react";

const faq = [
  {
    question: "Does resizing an image reduce its quality?",
    answer: "If you are making the image smaller, the quality generally remains excellent. If you are enlarging an image, it may become blurry or pixelated.",
  },
  {
    question: "What is aspect ratio?",
    answer: "Aspect ratio is the proportional relationship between an image's width and height. Keeping the lock icon active ensures your image isn't stretched or squished when resizing.",
  },
  {
    question: "Are my images uploaded to a server?",
    answer: "No! All resizing happens right in your web browser using your device's memory. Your images remain completely private.",
  },
];

export default function ImageResizerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [resizing, setResizing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ width: img.naturalWidth, height: img.naturalHeight });
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.src = url;
  }, []);

  const handleWidthChange = (val: string) => {
    const w = parseInt(val) || "";
    setWidth(w);
    if (maintainAspect && w !== "" && originalDims.width > 0) {
      const ratio = originalDims.height / originalDims.width;
      setHeight(Math.round(w * ratio));
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val) || "";
    setHeight(h);
    if (maintainAspect && h !== "" && originalDims.height > 0) {
      const ratio = originalDims.width / originalDims.height;
      setWidth(Math.round(h * ratio));
    }
  };

  const handleResizeAndDownload = () => {
    if (!preview || !width || !height || !canvasRef.current) return;
    setResizing(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Number(width);
    canvas.height = Number(height);

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          const baseName = file?.name.replace(/\.[^.]+$/, "") || "image";
          link.download = `${baseName}-resized.png`;
          link.click();
          setResizing(false);
        },
        "image/png",
        1
      );
    };
    img.src = preview;
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setWidth("");
    setHeight("");
    setOriginalDims({ width: 0, height: 0 });
  };

  return (
    <ToolLayout toolId="image-resizer" faq={faq}>
      <div className="space-y-8">
        {!file ? (
          <label
            className={`drop-zone rounded-2xl p-16 flex flex-col items-center justify-center cursor-pointer ${dragOver ? "drag-over" : ""}`}
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
            <ImageIcon className="w-12 h-12 text-[var(--muted)] mb-4" />
            <p className="text-lg font-medium text-[var(--foreground)] mb-2">
              Drop an image here to resize
            </p>
            <p className="text-sm text-[var(--muted-light)]">Supports JPG, PNG, WebP</p>
          </label>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="glass rounded-2xl p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)] truncate max-w-[200px]">
                    {file.name}
                  </h3>
                  <p className="text-xs text-[var(--muted)]">
                    Original: {originalDims.width} × {originalDims.height}px
                  </p>
                </div>
                <button
                  onClick={clear}
                  className="p-2 rounded-lg hover:bg-[rgba(255,107,107,0.1)] text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 min-h-[300px] bg-black/20 rounded-xl flex items-center justify-center p-4 overflow-hidden relative">
                <img
                  src={preview!}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="glass rounded-2xl p-6 flex flex-col justify-center">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-6">Resize Options</h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1">
                  <label className="block text-xs text-[var(--muted-light)] mb-2">Width (px)</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
                
                <button
                  onClick={() => setMaintainAspect(!maintainAspect)}
                  className={`mt-6 p-2 rounded-lg transition-colors ${maintainAspect ? 'text-[var(--accent)] bg-[rgba(0,206,201,0.1)]' : 'text-[var(--muted)] hover:bg-[var(--card-hover)]'}`}
                  title={maintainAspect ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                >
                  {maintainAspect ? <Link2 className="w-5 h-5" /> : <Unlink className="w-5 h-5" />}
                </button>

                <div className="flex-1">
                  <label className="block text-xs text-[var(--muted-light)] mb-2">Height (px)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-8">
                {[25, 50, 75, 200].map((percent) => (
                  <button
                    key={percent}
                    onClick={() => {
                      const ratio = percent / 100;
                      setWidth(Math.round(originalDims.width * ratio));
                      setHeight(Math.round(originalDims.height * ratio));
                    }}
                    className="py-2 text-xs font-semibold rounded-lg bg-[var(--card)] text-[var(--muted-light)] hover:text-[var(--foreground)] hover:border-[var(--accent)] border border-[var(--border)] transition-colors"
                  >
                    {percent}%
                  </button>
                ))}
              </div>

              <button
                onClick={handleResizeAndDownload}
                disabled={!width || !height || resizing}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                {resizing ? "Resizing..." : "Resize & Download"}
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </ToolLayout>
  );
}
