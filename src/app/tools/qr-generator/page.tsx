import type { Metadata } from "next";
import QRGeneratorClient from "./QRGeneratorClient";

export const metadata: Metadata = {
  title: "Free QR Code Generator — Create QR Codes Online | ToolBox",
  description:
    "Generate QR codes for URLs, text, email, and more. Download as PNG. Free online QR code generator — no sign-up required.",
  keywords: "qr code generator, create qr code, qr code maker, free qr code",
};

export default function QRGeneratorPage() {
  return <QRGeneratorClient />;
}
