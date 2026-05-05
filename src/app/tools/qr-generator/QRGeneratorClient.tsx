"use client";

import { useState, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import QRCode from "qrcode";
import { Download, Link2, Mail, Type } from "lucide-react";

const faq = [
  {
    question: "What can I encode in a QR code?",
    answer: "You can encode any text, URL, email address, or message. When scanned, URLs will open in a browser automatically.",
  },
  {
    question: "What format is the QR code downloaded in?",
    answer: "QR codes are downloaded as PNG images, which are compatible with all devices and platforms.",
  },
  {
    question: "Is there a limit on QR codes I can create?",
    answer: "No, you can generate unlimited QR codes completely free. There are no daily limits or restrictions.",
  },
  {
    question: "Are the QR codes permanent?",
    answer: "Yes! Our QR codes are static, meaning they work forever. The data is embedded directly in the code — no server dependency.",
  },
];

const presets = [
  { label: "URL", icon: Link2, prefix: "https://", placeholder: "https://example.com" },
  { label: "Text", icon: Type, prefix: "", placeholder: "Enter any text..." },
  { label: "Email", icon: Mail, prefix: "mailto:", placeholder: "mailto:hello@example.com" },
];

export default function QRGeneratorClient() {
  const [text, setText] = useState("https://example.com");
  const [activePreset, setActivePreset] = useState(0);
  const [size, setSize] = useState(300);
  const [fgColor, setFgColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#0a0b14");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (!text.trim() || !canvasRef.current) return;

    QRCode.toCanvas(canvasRef.current, text, {
      width: size,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: "M",
    })
      .then(() => setGenerated(true))
      .catch(() => setGenerated(false));
  }, [text, size, fgColor, bgColor]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <ToolLayout toolId="qr-generator" faq={faq}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-6">
          {/* Presets */}
          <div className="flex gap-2">
            {presets.map((preset, i) => {
              const Icon = preset.icon;
              return (
                <button
                  key={preset.label}
                  onClick={() => {
                    setActivePreset(i);
                    setText(preset.prefix);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    activePreset === i
                      ? "bg-[var(--accent)] text-white"
                      : "glass text-[var(--muted-light)] hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Text Input */}
          <div className="glass rounded-2xl p-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={presets[activePreset].placeholder}
              className="w-full h-[140px] bg-transparent text-[var(--foreground)] placeholder-[var(--muted)] resize-none p-5 rounded-xl outline-none text-sm leading-relaxed font-[inherit]"
              id="qr-input"
            />
          </div>

          {/* Settings */}
          <div className="glass rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Settings</h3>

            {/* Size */}
            <div>
              <label className="text-xs text-[var(--muted)] mb-2 block">
                Size: {size}px
              </label>
              <input
                type="range"
                min={100}
                max={600}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[var(--muted)] mb-2 block">Foreground</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs text-[var(--muted-light)] font-mono">{fgColor}</span>
                </div>
              </div>
              <div>
                <label className="text-xs text-[var(--muted)] mb-2 block">Background</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs text-[var(--muted-light)] font-mono">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview & Download */}
        <div className="flex flex-col items-center">
          <div className="glass rounded-2xl p-8 flex flex-col items-center gap-6 w-full">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">Preview</h3>
            <div
              className="rounded-xl overflow-hidden flex items-center justify-center"
              style={{ background: bgColor, padding: 16 }}
            >
              <canvas ref={canvasRef} />
            </div>
            <button
              onClick={handleDownload}
              disabled={!generated || !text.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download QR Code (PNG)
            </button>
          </div>

          <p className="text-xs text-[var(--muted)] mt-4 text-center max-w-xs">
            QR code generated in your browser. No data sent to any server.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
