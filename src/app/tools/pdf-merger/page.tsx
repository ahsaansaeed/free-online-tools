import type { Metadata } from "next";
import PDFMergerClient from "./PDFMergerClient";

export const metadata: Metadata = {
  title: "Free PDF Merger Online — Combine PDF Files | ToolBox",
  description:
    "Merge multiple PDF files into one document. Reorder pages with drag and drop. Free online PDF merger — your files never leave your browser.",
  keywords: "merge pdf, combine pdf, pdf merger online, join pdf files",
};

export default function PDFMergerPage() {
  return <PDFMergerClient />;
}
