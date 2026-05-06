"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Terminal", href: "#terminal" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "py-3 border-b border-border-default bg-(--bg-base)/80 backdrop-blur-xl"
          : "py-5 bg-transparent"
          }`}
      >
        <div className="section-container flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick("#hero"); }}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative w-9 h-9 rounded-[10px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-accent to-accent-cyan opacity-90" />
              <Zap className="relative z-10 w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight text-text-primary group-hover:text-accent-secondary transition-colors">
              prayag.dev
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                id={`nav-${link.label.toLowerCase()}`}
                onClick={() => handleNavClick(link.href)}
                className="relative px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-elevated group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </motion.button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <motion.button
                id="theme-toggle"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-bg-elevated border border-border-default hover:border-accent hover:bg-bg-overlay transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme}
                    initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.2 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 text-accent-amber" />
                    ) : (
                      <Moon className="w-4 h-4 text-accent-primary" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            )}

            {/* Mobile menu toggle */}
            <motion.button
              id="mobile-menu-toggle"
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-bg-elevated border border-border-default"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.92 }}
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "open"}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileOpen ? (
                    <X className="w-4 h-4 text-text-primary" />
                  ) : (
                    <Menu className="w-4 h-4 text-text-primary" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-16 z-40 md:hidden bg-bg-surface/95 backdrop-blur-xl border-b border-border-default px-6 py-4 flex flex-col gap-1"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-all"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
