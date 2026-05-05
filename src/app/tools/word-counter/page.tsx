import type { Metadata } from "next";
import WordCounterClient from "./WordCounterClient";

export const metadata: Metadata = {
  title: "Free Word Counter Online — Count Words, Characters & Sentences | ToolBox",
  description:
    "Count words, characters, sentences, and paragraphs instantly. Estimate reading time. Free online word counter — no sign-up required.",
  keywords: "word counter, character count, word count tool, reading time calculator",
};

export default function WordCounterPage() {
  return <WordCounterClient />;
}
