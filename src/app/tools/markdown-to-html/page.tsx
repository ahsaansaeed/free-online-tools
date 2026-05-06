import type { Metadata } from "next";
import MarkdownClient from "./MarkdownClient";

export const metadata: Metadata = {
  title: "Free Markdown to HTML Converter Online | ToolBox",
  description:
    "Convert your Markdown text into clean, formatted HTML code instantly. Live preview and easy copy-to-clipboard functionality.",
  keywords: "markdown to html, md to html, convert markdown, markdown converter online",
};

export default function MarkdownPage() {
  return <MarkdownClient />;
}
