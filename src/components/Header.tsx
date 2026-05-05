"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Wrench } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "All Tools" },
  { href: "/blog", label: "Blog" },
  { href: "#about", label: "About" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] flex items-center justify-center transition-transform group-hover:scale-110">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ToolBox</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--muted-light)] hover:text-[var(--foreground)] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Privacy Badge */}
          <div className="hidden md:flex items-center gap-2 text-xs text-[var(--success)] bg-[rgba(0,206,201,0.08)] px-3 py-1.5 rounded-full border border-[rgba(0,206,201,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            100% Private — Files stay on your device
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[var(--muted-light)] hover:text-[var(--foreground)]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-[var(--muted-light)] hover:text-[var(--foreground)] transition-colors font-medium px-3 py-2 rounded-lg hover:bg-[var(--card-hover)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2 text-xs text-[var(--success)] mt-3 px-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" />
              100% Private — Files stay on your device
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
