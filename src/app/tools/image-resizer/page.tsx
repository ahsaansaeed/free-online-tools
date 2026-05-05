import type { Metadata } from "next";
import ImageResizerClient from "./ImageResizerClient";

export const metadata: Metadata = {
  title: "Free Image Resizer Online — Change Image Dimensions | ToolBox",
  description:
    "Resize JPG, PNG, and WebP images to exact pixel dimensions. Free online image resizer. 100% private — your files never leave your browser.",
  keywords: "image resizer, resize image online, change image dimensions, scale image",
};

export default function ImageResizerPage() {
  return <ImageResizerClient />;
}
