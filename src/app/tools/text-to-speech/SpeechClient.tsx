"use client";

import { useState, useEffect, useRef } from "react";
import ToolLayout from "@/components/ToolLayout";
import { Play, Pause, RotateCcw, Volume2, Settings, User, Sliders, Trash2 } from "lucide-react";

const faq = [
  {
    question: "How does Text to Speech work?",
    answer: "We use the Web Speech API integrated into your browser. This allows us to convert text into audio using the voices available on your operating system.",
  },
  {
    question: "Can I download the audio?",
    answer: "The Web Speech API doesn't natively support direct MP3 downloading. However, you can listen to it instantly, or use a system-wide audio recorder if needed.",
  },
  {
    question: "Are there different voices available?",
    answer: "Yes! The available voices depend on your device (Windows, macOS, iOS, or Android). We automatically list all available voices on your system.",
  },
];

export default function SpeechClient() {
  const [text, setText] = useState("Hello! Welcome to ToolBox. This is our natural-sounding text to speech converter.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Try to find a nice English voice by default
        const defaultVoice = availableVoices.find(v => v.lang.includes("en-US")) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!synthRef.current || !text) return;

    if (isSpeaking) {
      synthRef.current.pause();
      setIsSpeaking(false);
      return;
    }

    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsSpeaking(true);
      return;
    }

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
    setIsSpeaking(true);
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clear = () => {
    setText("");
    handleStop();
  };

  return (
    <ToolLayout toolId="text-to-speech" faq={faq}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Input */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-bold text-[var(--muted)] uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[var(--accent)]" /> Text Input
            </label>
            <button
              onClick={clear}
              className="p-2 text-[var(--muted)] hover:text-[var(--danger)] transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="glass rounded-2xl p-6 min-h-[400px] flex flex-col border border-[var(--border)] focus-within:border-[var(--accent)] transition-colors">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to speak..."
              className="w-full h-full bg-transparent text-[var(--foreground)] text-lg leading-relaxed focus:outline-none resize-none placeholder-[var(--muted)]"
            />
            
            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSpeak}
                className={`flex-1 btn-primary py-4 text-base flex items-center justify-center gap-3 shadow-lg shadow-[var(--accent)]/20 ${isSpeaking ? 'bg-[var(--danger)] shadow-[var(--danger)]/20' : ''}`}
              >
                {isSpeaking ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                {isSpeaking ? "Pause" : "Listen Now"}
              </button>
              <button
                onClick={handleStop}
                className="btn-secondary px-6 flex items-center justify-center"
                title="Stop and Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Settings */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 space-y-8 border border-[var(--border)]">
            <h3 className="text-sm font-bold text-[var(--foreground)] uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-4 h-4 text-[var(--accent)]" /> Voice Settings
            </h3>

            {/* Voice Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[var(--muted)] flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Select Voice
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
                {voices.length === 0 && <option>No voices detected</option>}
              </select>
            </div>

            {/* Rate Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[var(--muted)] flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" /> Speed ({rate}x)
                </label>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>

            {/* Pitch Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-[var(--muted)] flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5" /> Pitch ({pitch}x)
                </label>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          </div>

          <div className="bg-[rgba(0,206,201,0.05)] border border-[rgba(0,206,201,0.1)] rounded-2xl p-6">
             <p className="text-xs text-[var(--muted-light)] leading-relaxed">
               <span className="font-bold text-[var(--accent)]">Pro Tip:</span> Different operating systems provide different voices. For the best experience, try using Microsoft Edge or Chrome.
             </p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
