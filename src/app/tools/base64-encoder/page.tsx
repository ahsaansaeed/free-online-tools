import type { Metadata } from "next";
import Base64Client from "./Base64Client";

export const metadata: Metadata = {
  title: "Free Base64 Encoder & Decoder Online | ToolBox",
  description:
    "Encode text and files to Base64 or decode Base64 strings back to their original format. 100% free, private, and processes locally in your browser.",
  keywords: "base64 encoder, base64 decoder, base64 to image, text to base64",
};

export default function Base64Page() {
  return <Base64Client />;
}
