import {
  Image,
  FileText,
  QrCode,
  Type,
  ArrowRightLeft,
  Maximize,
  Code,
  Palette,
  Binary,
  FileImage,
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
  {
    id: "image-resizer",
    name: "Image Resizer",
    description:
      "Resize JPG, PNG, and WebP images to exact pixel dimensions or percentages. Perfect for social media banners, profile pictures, and websites.",
    shortDescription: "Resize images to exact dimensions",
    href: "/tools/image-resizer",
    icon: Maximize,
    category: "Image",
    keywords: ["image resizer", "resize image online", "change image size"],
    color: "#00b894",
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description:
      "Format, beautify, and validate your JSON data. Easy to read, syntax highlighted, and completely processed in your browser.",
    shortDescription: "Format and validate JSON data",
    href: "/tools/json-formatter",
    icon: Code,
    category: "Developer",
    keywords: ["json formatter", "json beautifier", "validate json"],
    color: "#0984e3",
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description:
      "Extract colors from images or generate custom color palettes. Get exact HEX, RGB, and HSL values instantly.",
    shortDescription: "Extract and generate color palettes",
    href: "/tools/color-picker",
    icon: Palette,
    category: "Design",
    keywords: ["color picker", "hex color", "color palette generator"],
    color: "#ff7675",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description:
      "Easily encode text or files to Base64, or decode Base64 back to its original format. Developer-friendly and secure.",
    shortDescription: "Encode & decode Base64 strings",
    href: "/tools/base64-encoder",
    icon: Binary,
    category: "Developer",
    keywords: ["base64 encoder", "base64 decoder", "base64 converter"],
    color: "#636e72",
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description:
      "Convert PDF pages into high-quality JPG or PNG images. Entirely client-side for maximum privacy and speed.",
    shortDescription: "Convert PDF pages to JPG/PNG",
    href: "/tools/pdf-to-image",
    icon: FileImage,
    category: "PDF",
    keywords: ["pdf to image", "pdf to jpg", "pdf to png"],
    color: "#d63031",
  },
];

export const categories = [...new Set(tools.map((t) => t.category))];
