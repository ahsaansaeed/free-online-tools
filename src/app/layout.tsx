import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ToolBox — Free Online Tools | Convert, Compress & Create",
  description:
    "15+ free online tools — image compressor, PDF merger, QR generator, and more. 100% free, 100% private. Files never leave your browser.",
  keywords:
    "free online tools, image compressor, pdf merger, qr code generator, word counter, file converter",
  openGraph: {
    title: "ToolBox — Free Online Tools",
    description:
      "Convert, compress, and create — 100% free, 100% private. Files never leave your browser.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen flex flex-col grid-bg relative overflow-x-hidden">
        {/* Background glow orbs */}
        <div
          className="glow-orb"
          style={{
            width: 500,
            height: 500,
            background: "var(--accent)",
            top: -100,
            left: -100,
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: 400,
            height: 400,
            background: "var(--success)",
            top: 300,
            right: -100,
          }}
        />

        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-XYZ1234567" />
    </html>
  );
}
