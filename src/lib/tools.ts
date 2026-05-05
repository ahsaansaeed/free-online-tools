import {
  Image,
  FileText,
  QrCode,
  Type,
  ArrowRightLeft,
  LucideIcon,
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  href: string;
  icon: LucideIcon;
  category: string;
  keywords: string[];
  color: string;
}

export const tools: Tool[] = [
  {
    id: "image-compressor",
    name: "Image Compressor",
    description:
      "Compress JPG, PNG, and WebP images without losing quality. Reduce file sizes by up to 80% — perfect for websites, emails, and social media.",
    shortDescription: "Reduce image file size by up to 80%",
    href: "/tools/image-compressor",
    icon: Image,
    category: "Image",
    keywords: ["compress image", "reduce image size", "image compressor online"],
    color: "#6c5ce7",
  },
  {
    id: "pdf-merger",
    name: "PDF Merger",
    description:
      "Merge multiple PDF files into one document. Drag and drop to reorder pages. Fast, free, and completely private — your PDFs never leave your browser.",
    shortDescription: "Combine multiple PDFs into one file",
    href: "/tools/pdf-merger",
    icon: FileText,
    category: "PDF",
    keywords: ["merge pdf", "combine pdf", "pdf merger online"],
    color: "#e17055",
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description:
      "Generate QR codes for URLs, text, emails, and more. Download as PNG or SVG. Customize size and colors — completely free.",
    shortDescription: "Create QR codes for any text or URL",
    href: "/tools/qr-generator",
    icon: QrCode,
    category: "Utility",
    keywords: ["qr code generator", "create qr code", "qr code maker"],
    color: "#00cec9",
  },
  {
    id: "word-counter",
    name: "Word Counter",
    description:
      "Count words, characters, sentences, and paragraphs instantly. Estimate reading time for your content. Perfect for students, writers, and marketers.",
    shortDescription: "Count words, characters & reading time",
    href: "/tools/word-counter",
    icon: Type,
    category: "Text",
    keywords: ["word counter", "character count", "word count tool"],
    color: "#fdcb6e",
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description:
      "Convert images between JPG, PNG, and WebP formats. Batch convert multiple images at once. Free, fast, and private.",
    shortDescription: "Convert between JPG, PNG & WebP",
    href: "/tools/image-converter",
    icon: ArrowRightLeft,
    category: "Image",
    keywords: ["jpg to png", "png to jpg", "image converter", "webp converter"],
    color: "#a29bfe",
  },
];

export const categories = [...new Set(tools.map((t) => t.category))];
