"use client";

import { useState, useRef, useEffect } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Upload, Music, Download, Trash2, Settings, RefreshCcw, Check } from "lucide-react";
import Script from "next/script";

const faq = [
  {
    question: "How does the MP4 to MP3 extraction work?",
    answer: "We use FFmpeg.wasm, a webassembly port of the famous FFmpeg multimedia framework. It allows us to process video files directly in your browser without any server-side processing, ensuring your data stays private.",
  },
  {
    question: "Is there a file size limit?",
    answer: "Since the processing happens in your browser's memory, we recommend files under 100MB for the best experience. Larger files may cause your browser to slow down or crash depending on your device's RAM.",
  },
  {
    question: "Will the audio quality be maintained?",
    answer: "Yes, we extract the audio stream directly and re-encode it to high-quality MP3 format, preserving as much clarity as possible from the original source.",
  },
];

declare global {
  interface Window {
    FFmpeg: any;
    FFmpegUtil: any;
  }
}

export default function MP4ToMP3Client() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [libLoaded, setLibLoaded] = useState(false);
  
  const ffmpegRef = useRef<any>(null);

  const handleFile = (inputFile: File) => {
    if (!inputFile.type.startsWith("video/")) {
      alert("Please upload a video file.");
      return;
    }
    setFile(inputFile);
    setAudioUrl(null);
    setProgress(0);
    setStatus("");
  };

  const convertToMP3 = async () => {
    if (!file || !window.FFmpeg) return;
    setLoading(true);
    setProgress(0);
    setStatus("Loading FFmpeg engine...");

    try {
      const { FFmpeg } = window.FFmpeg;
      const { fetchFile, toBlobURL } = window.FFmpegUtil;

      if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
      }
      
      const ffmpeg = ffmpegRef.current;

      // Load FFmpeg
      const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });

      setStatus("Processing video...");
      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
        setProgress(Math.round(p * 100));
      });

      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      
      // Extract audio to MP3
      // -i input -vn (no video) -ab 192k (bitrate) -ar 44100 (sample rate) -y output.mp3
      await ffmpeg.exec(["-i", "input.mp4", "-vn", "-ab", "192k", "-ar", "44100", "-y", "output.mp3"]);

      const data = await ffmpeg.readFile("output.mp3");
      const blob = new Blob([data], { type: "audio/mpeg" });
      setAudioUrl(URL.createObjectURL(blob));
      setStatus("Extraction complete!");
    } catch (err) {
      console.error("FFmpeg Error:", err);
      alert("Failed to extract audio. Your browser might not support the required features (SharedArrayBuffer).");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFile(null);
    setAudioUrl(null);
    setProgress(0);
    setStatus("");
  };

  return (
    <ToolLayout toolId="mp4-to-mp3" faq={faq}>
      <Script 
        src="https://unpkg.com/@ffmpeg/ffmpeg@0.12.7/dist/umd/ffmpeg.js"
        onLoad={() => {
          if (window.FFmpegUtil) setLibLoaded(true);
        }}
      />
      <Script 
        src="https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js"
        onLoad={() => {
          if (window.FFmpeg) setLibLoaded(true);
        }}
      />

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
              accept="video/mp4,video/x-m4v,video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
              }}
            />
            <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-6">
              <Music className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <p className="text-xl font-bold text-[var(--foreground)] mb-2">
              Drop an MP4 video here to extract audio
            </p>
            <p className="text-[var(--muted)]">Supports most video formats (Up to 100MB Recommended)</p>
          </label>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center shrink-0">
                  <Music className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-[var(--foreground)] truncate" title={file.name}>
                    {file.name}
                  </h3>
                  <p className="text-[var(--muted)]">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={clear}
                  disabled={loading}
                  className="p-2 text-[var(--muted)] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>

              {!audioUrl ? (
                <div className="space-y-6">
                  <button
                    onClick={convertToMP3}
                    disabled={loading || !libLoaded}
                    className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <RefreshCcw className="w-6 h-6 animate-spin" />
                        {status} ({progress}%)
                      </>
                    ) : (
                      <>
                        <Music className="w-6 h-6" />
                        Extract MP3 Audio
                      </>
                    )}
                  </button>
                  
                  {loading && (
                    <div className="w-full bg-[var(--card)] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[var(--accent)] h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  
                  {!libLoaded && !loading && (
                    <p className="text-center text-sm text-[var(--muted)]">
                      Loading processing engine...
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in-up">
                  <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                    <audio src={audioUrl} controls className="w-full" />
                  </div>
                  
                  <div className="flex gap-4">
                    <a
                      href={audioUrl}
                      download={`${file.name.split(".")[0]}.mp3`}
                      className="btn-primary flex-1 py-4 text-lg font-bold flex items-center justify-center gap-2"
                      style={{ background: "linear-gradient(135deg, #6c5ce7, #a29bfe)" }}
                    >
                      <Download className="w-6 h-6" />
                      Download MP3
                    </a>
                    <button
                      onClick={clear}
                      className="btn-secondary px-6"
                    >
                      <RefreshCcw className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
                    <Check className="w-4 h-4 text-green-500" />
                    Audio extracted successfully!
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-4">
              <div className="shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center text-xs font-bold">!</div>
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> MP4 to MP3 conversion requires cross-origin isolation. If the tool fails to load, ensure your browser is up to date.
              </p>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
