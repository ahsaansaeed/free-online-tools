import type { Metadata } from "next";
import LoremIpsumClient from "./LoremIpsumClient";

export const metadata: Metadata = {
  title: "Free Lorem Ipsum Generator Online | ToolBox",
  description:
    "Generate custom placeholder text for your designs. Choose paragraphs, sentences, or words. 100% free and easy to use.",
  keywords: "lorem ipsum generator, placeholder text, text generator, dummy text",
};

export default function LoremIpsumPage() {
  return <LoremIpsumClient />;
}
