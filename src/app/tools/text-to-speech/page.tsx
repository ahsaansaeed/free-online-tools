import type { Metadata } from "next";
import SpeechClient from "./SpeechClient";

export const metadata: Metadata = {
  title: "Free Text to Speech Online | Natural Voices | ToolBox",
  description:
    "Convert text to natural-sounding speech instantly. Choose from various voices and download as MP3. Free online TTS tool.",
  keywords: "text to speech, tts online, convert text to audio, speech generator",
};

export default function SpeechPage() {
  return <SpeechClient />;
}
