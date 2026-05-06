"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Download, GitBranch, Link2, Mail, Sparkles } from "lucide-react";

// Animated SVG grid that reacts to mouse
function InteractiveGrid() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 40);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(124,92,252,0.15),transparent)]" />
      {/* Mouse-reactive grid */}
      <motion.div
        className="absolute inset-[-20%] opacity-30"
        style={{ x: springX, y: springY }}
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(124,92,252,0.25)" strokeWidth="0.8" />
            </pattern>
            <radialGradient id="fade" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="grid-mask">
              <rect width="100%" height="100%" fill="url(#fade)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" mask="url(#grid-mask)" />
        </svg>
      </motion.div>
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)",
          x: useTransform(springX, v => v * 1.5),
          y: useTransform(springY, v => v * 1.5),
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)",
          x: useTransform(springX, v => v * -1),
          y: useTransform(springY, v => v * -1),
        }}
      />
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = ["Full Stack Engineer", "Visual Logic Architect", "Real-Time Systems Builder"];

  useEffect(() => {
    const t = setInterval(() => {
      setTitleIndex(i => (i + 1) % titles.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <InteractiveGrid />

      <div className="section-container relative z-10 py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Available badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-elevated border border-border-default text-sm">
              <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse-glow" />
              <span className="text-text-secondary font-mono text-xs tracking-wider">
                Available for opportunities
              </span>
              <Sparkles className="w-3.5 h-3.5 text-accent-secondary" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="flex flex-col items-center gap-1 mb-6"
          >
            <span className="text-xl sm:text-2xl lg:text-3xl font-medium text-text-muted tracking-wide">
              Building the logic
            </span>
            <span className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight gradient-text-shimmer">
              behind the visual.
            </span>
          </motion.h1>

          {/* Rotating subtitle */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6 h-10">
            <div className="relative overflow-hidden">
              <motion.div
                key={titleIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="font-mono text-lg sm:text-xl text-accent-secondary font-medium"
              >
                {"// "}{titles[titleIndex]}
              </motion.div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Full Stack Engineer crafting real-time systems, AI-powered tools, and
            pixel-perfect UIs. From{" "}
            <span className="text-text-primary font-medium">WhatsApp CRM</span> to{" "}
            <span className="text-text-primary font-medium">visual chatbot builders</span>
            {" "}— I ship products that scale.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <motion.button
              id="hero-view-projects"
              onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent-primary text-white font-semibold text-sm hover:bg-accent-secondary transition-all shadow-lg hover:shadow-[0_0_30px_accent-glow]"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              View Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.a
              id="hero-download-resume"
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-bg-elevated border border-border-strong text-text-primary font-semibold text-sm hover:border-accent hover:text-accent-secondary transition-all"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download className="w-4 h-4" />
              Download Resume
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            {[
              { icon: GitBranch, href: "https://github.com/prayagsonagra", label: "GitHub" },
              { icon: Link2, href: "https://linkedin.com/in/prayagsonagra", label: "LinkedIn" },
              { icon: Mail, href: "mailto:sonagraprayag2@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-elevated border border-border-default text-text-secondary hover:text-accent-secondary hover:border-accent transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icon className="w-4.5 h-4.5" />
              </motion.a>
            ))}

            <div className="w-px h-5 bg-border-default mx-2" />
            <span className="font-mono text-xs text-text-muted">
              prayag@dev
              <span className="animate-blink">_</span>
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        {/* <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-text-muted text-xs font-mono tracking-wider">scroll</span>
          <motion.div
            className="w-5 h-8 rounded-full border border-border-strong flex justify-center pt-1.5"
          >
            <motion.div
              className="w-1 h-2 rounded-full bg-accent-primary"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div> */}
      </div>
    </section>
  );
}
