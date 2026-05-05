"use client";

import { useState, useRef, useCallback } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Trash2, Image as ImageIcon, Copy, Plus, Shuffle } from "lucide-react";

const faq = [
  {
    question: "How do I extract a color from an image?",
    answer: "Simply upload your image, and then click anywhere on the image preview. The exact color of the pixel you clicked will be captured and added to your palette.",
  },
  {
    question: "What color formats are supported?",
    answer: "We automatically convert colors to HEX (e.g., #FF5733), RGB (e.g., rgb(255, 87, 51)), and HSL values.",
  },
  {
    question: "Is this tool secure?",
    answer: "Yes! All image processing happens locally in your browser. Images are never uploaded to any server.",
  },
];

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("");
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

interface SavedColor {
  hex: string;
  rgb: string;
  hsl: string;
}

export default function ColorPickerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [currentColor, setCurrentColor] = useState<SavedColor>({ hex: "#6c5ce7", rgb: "rgb(108, 92, 231)", hsl: "hsl(247, 72%, 63%)" });
  const [savedColors, setSavedColors] = useState<SavedColor[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!canvasRef.current || !imgRef.current) return;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // We need to map the click coordinates to the actual image pixels
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Draw just that pixel to the canvas to read it
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    const pixelData = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    const r = pixelData[0];
    const g = pixelData[1];
    const b = pixelData[2];

    const hex = rgbToHex(r, g, b);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const hsl = rgbToHsl(r, g, b);

    setCurrentColor({ hex, rgb, hsl });
  };

  const saveColor = () => {
    if (!savedColors.find(c => c.hex === currentColor.hex)) {
      setSavedColors([currentColor, ...savedColors].slice(0, 10)); // Keep max 10
    }
  };

  const generateRandomPalette = () => {
    const r = () => Math.floor(Math.random() * 256);
    const hex = rgbToHex(r(), r(), r());
    const rgb = `rgb(${r()}, ${r()}, ${r()})`; // slightly inaccurate if just random but fine for demo
    
    // Better way:
    const rr = r(), gg = r(), bb = r();
    setCurrentColor({
      hex: rgbToHex(rr, gg, bb),
      rgb: `rgb(${rr}, ${gg}, ${bb})`,
      hsl: rgbToHsl(rr, gg, bb)
    });
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  return (
    <ToolLayout toolId="color-picker" faq={faq}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Image Area */}
        <div className="lg:col-span-2 space-y-6">
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
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
                }}
              />
              <ImageIcon className="w-12 h-12 text-[var(--muted)] mb-4" />
              <p className="text-lg font-medium text-[var(--foreground)] mb-2">
                Drop an image to extract colors
              </p>
              <p className="text-sm text-[var(--muted-light)]">Or click to browse</p>
            </label>
          ) : (
            <div className="glass rounded-2xl p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4 px-2">
                <p className="text-sm font-semibold text-[var(--foreground)]">Click anywhere on the image</p>
                <button
                  onClick={clear}
                  className="p-2 rounded-lg hover:bg-[rgba(255,107,107,0.1)] text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="w-full bg-black/20 rounded-xl flex items-center justify-center overflow-hidden relative cursor-crosshair">
                <img
                  ref={imgRef}
                  src={preview!}
                  alt="Preview"
                  onClick={handleImageClick}
                  className="max-w-full max-h-[600px] object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Colors Area */}
        <div className="space-y-6">
          {/* Current Color Picker */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Current Color</h3>
            
            <div 
              className="w-full h-32 rounded-xl mb-6 border border-[rgba(255,255,255,0.1)] shadow-lg transition-colors duration-300"
              style={{ backgroundColor: currentColor.hex }}
            />

            <div className="space-y-4 mb-6">
              {[
                { label: "HEX", value: currentColor.hex },
                { label: "RGB", value: currentColor.rgb },
                { label: "HSL", value: currentColor.hsl },
              ].map((fmt) => (
                <div key={fmt.label} className="flex items-center justify-between bg-[var(--card)] p-3 rounded-xl border border-[var(--border)] group">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[var(--muted)] w-8">{fmt.label}</span>
                    <span className="text-sm font-mono text-[var(--foreground)]">{fmt.value}</span>
                  </div>
                  <button 
                    onClick={() => copyText(fmt.value)}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--card-hover)] text-[var(--accent)]"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveColor}
                className="flex-1 btn-primary py-3 text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Save
              </button>
              {!file && (
                <button
                  onClick={generateRandomPalette}
                  className="flex-1 btn-secondary py-3 text-sm flex items-center justify-center gap-2"
                >
                  <Shuffle className="w-4 h-4" /> Random
                </button>
              )}
            </div>
          </div>

          {/* Saved Palette */}
          {savedColors.length > 0 && (
            <div className="glass rounded-2xl p-6 animate-fade-in-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[var(--foreground)]">Saved Palette</h3>
                <button onClick={() => setSavedColors([])} className="text-xs text-[var(--muted)] hover:text-[var(--danger)]">Clear</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {savedColors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentColor(color)}
                    className="aspect-square rounded-lg shadow-sm border border-[rgba(255,255,255,0.1)] transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                    style={{ backgroundColor: color.hex }}
                    title={color.hex}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </ToolLayout>
  );
}
