import { Metadata } from "next";
import MP4ToMP3Client from "./MP4ToMP3Client";

export const metadata: Metadata = {
  title: "MP4 to MP3 - Extract Audio from Video Online",
  description: "Extract high-quality MP3 audio from MP4 video files instantly. Our free online converter works entirely in your browser for 100% privacy.",
  keywords: ["mp4 to mp3", "extract audio", "video to mp3", "convert mp4 to mp3", "online audio extractor"],
};

export default function MP4ToMP3Page() {
  return <MP4ToMP3Client />;
}
