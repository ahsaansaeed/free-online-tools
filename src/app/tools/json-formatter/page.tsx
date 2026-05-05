import type { Metadata } from "next";
import JsonFormatterClient from "./JsonFormatterClient";

export const metadata: Metadata = {
  title: "Free JSON Formatter & Validator Online | ToolBox",
  description:
    "Format, beautify, and validate your JSON data. Easily find syntax errors. 100% free online JSON formatter. Data never leaves your browser.",
  keywords: "json formatter, json beautifier, validate json, format json online",
};

export default function JsonFormatterPage() {
  return <JsonFormatterClient />;
}
