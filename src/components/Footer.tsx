import Link from "next/link";
import { Wrench, Shield, Zap, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">ToolBox</span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Free online tools that respect your privacy. All processing happens in your browser.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Popular Tools</h3>
            <ul className="space-y-2.5">
              {[
                { href: "/tools/image-compressor", label: "Image Compressor" },
                { href: "/tools/pdf-merger", label: "PDF Merger" },
                { href: "/tools/qr-generator", label: "QR Code Generator" },
                { href: "/tools/word-counter", label: "Word Counter" },
                { href: "/tools/image-converter", label: "Image Converter" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] hover:text-[var(--accent-light)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Company</h3>
            <ul className="space-y-2.5">
              {[
                { href: "#about", label: "About" },
                { href: "#privacy", label: "Privacy Policy" },
                { href: "#terms", label: "Terms of Service" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--muted)] hover:text-[var(--accent-light)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">Why ToolBox?</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <Shield className="w-4 h-4 text-[var(--success)]" />
                Files never leave your device
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <Zap className="w-4 h-4 text-[var(--warning)]" />
                Instant processing — no uploads
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <Heart className="w-4 h-4 text-[var(--danger)]" />
                100% free, no sign-up needed
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} ToolBox. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Powered by open-source technology ⚡
          </p>
        </div>
      </div>
    </footer>
  );
}
