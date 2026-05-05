import type { Metadata } from "next";
import ImageConverterClient from "./ImageConverterClient";

export const metadata: Metadata = {
  title: "Free Image Converter — JPG to PNG, WebP & More | ToolBox",
  description:
    "Convert images between JPG, PNG, and WebP formats instantly. Batch convert multiple files. Free online image converter — files never leave your browser.",
  keywords: "jpg to png, png to jpg, image converter, webp converter, convert image format",
};

export default function ImageConverterPage() {
  return <ImageConverterClient />;
}
