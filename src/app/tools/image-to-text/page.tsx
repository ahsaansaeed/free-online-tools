import { Metadata } from "next";
import ImageToTextClient from "./ImageToTextClient";

export const metadata: Metadata = {
  title: "Image to Text (OCR) - Extract Text from Images Online",
  description: "Extract text from images, photos, and scanned documents instantly. Our free online OCR tool supports multiple languages and processes everything in your browser.",
  keywords: ["image to text", "ocr online", "extract text from image", "picture to text", "free ocr"],
};

export default function ImageToTextPage() {
  return <ImageToTextClient />;
}
