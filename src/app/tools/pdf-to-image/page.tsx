import type { Metadata } from "next";
import PDFToImageClient from "./PDFToImageClient";

export const metadata: Metadata = {
  title: "Free PDF to Image Converter Online | ToolBox",
  description:
    "Convert PDF pages into high-quality JPG or PNG images. Fast, free, and completely private — your PDFs never leave your browser.",
  keywords: "pdf to image, pdf to jpg, pdf to png, convert pdf",
};

export default function PDFToImagePage() {
  return <PDFToImageClient />;
}
