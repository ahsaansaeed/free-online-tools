import type { Metadata } from "next";
import ImageCompressorClient from "./ImageCompressorClient";

export const metadata: Metadata = {
  title: "Free Image Compressor Online — Reduce Image Size | ToolBox",
  description:
    "Compress JPG, PNG, and WebP images without losing quality. Reduce file sizes by up to 80%. Free online image compressor — files never leave your browser.",
  keywords: "compress image, reduce image size, image compressor online, compress jpg, compress png",
};

export default function ImageCompressorPage() {
  return <ImageCompressorClient />;
}
