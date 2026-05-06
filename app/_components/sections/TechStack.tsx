"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const techStack = [
  {
    name: "React",
    category: "Frontend",
    color: "#61dafb",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="20" cy="20" rx="4" ry="4" fill="#61DAFB"/><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" stroke-width="2" fill="none"/><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" stroke-width="2" fill="none" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" stroke-width="2" fill="none" transform="rotate(120 20 20)"/></svg>`,
  },
  {
    name: "Next.js",
    category: "Framework",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="18" fill="black"/><path d="M12 28V14l18 18M24 14h4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  },
  {
    name: "TypeScript",
    category: "Language",
    color: "#3178c6",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="36" height="36" rx="4" fill="#3178C6"/><path d="M21 16h8M25 16v16M8 16h10M13 16v16" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  },
  {
    name: "Node.js",
    category: "Backend",
    color: "#84cc16",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4L36 13v14L20 36 4 27V13L20 4z" stroke="#84CC16" stroke-width="2" fill="none"/><path d="M20 10v10M20 20l8 5M20 20l-8 5" stroke="#84CC16" stroke-width="2" stroke-linecap="round"/></svg>`,
  },
  {
    name: "Socket.io",
    category: "Real-time",
    color: "#ffffff",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="16" stroke="white" stroke-width="2" fill="none"/><path d="M20 8C14 8 10 14 10 20" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M20 32C26 32 30 26 30 20" stroke="white" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="20" r="3" fill="white"/></svg>`,
  },
  {
    name: "MongoDB",
    category: "Database",
    color: "#47a248",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 4C20 4 12 14 12 22a8 8 0 0 0 16 0C28 14 20 4 20 4z" stroke="#47A248" stroke-width="2" fill="#47A248" fill-opacity="0.15"/><path d="M20 8v24" stroke="#47A248" stroke-width="2" stroke-linecap="round"/><path d="M20 30c1.5-2 4-4 4-8" stroke="#47A248" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
  },
  // {
  //   name: "Python",
  //   category: "Language",
  //   color: "#facc15",
  //   svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 8c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v8H14V8z" fill="#3B82F6" fill-opacity="0.8"/><path d="M14 16h12v8H14z" fill="none" stroke="#FACC15" stroke-width="1.5"/><path d="M26 24c0 2.2-1.8 4-4 4h-4c-2.2 0-4-1.8-4-4v-8h12v8z" fill="#FACC15" fill-opacity="0.8"/><circle cx="17" cy="11" r="1.5" fill="white"/><circle cx="23" cy="29" r="1.5" fill="#1e3a5f"/></svg>`,
  // },
  {
    name: "Redux Toolkit",
    category: "State",
    color: "#764abc",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25 8a5 5 0 0 1 4.5 7.5" stroke="#764ABC" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M27 18c0 4-3 7-7 7s-7-3-7-7c0-2.4 1.2-4.5 3-5.8" stroke="#764ABC" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M15 32a5 5 0 0 1-4.5-7.5" stroke="#764ABC" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="27" cy="10" r="2.5" fill="#764ABC"/><circle cx="11" cy="30" r="2.5" fill="#764ABC"/><circle cx="30" cy="26" r="2.5" fill="#764ABC"/></svg>`,
  },
  {
    name: "Tailwind",
    category: "CSS",
    color: "#38bdf8",
    svg: `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 22c2-8 7-12 12-8-4 0-6 3-4 8 2-8 7-12 12-8" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M22 30c2-8 7-12 12-8" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg>`,
  },
];


function TechCard({
  tech,
  index,
}: {
  tech: (typeof techStack)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      id={`tech-${tech.name.toLowerCase().replace(/\./g, "").replace(/\s/g, "-")}`}
      className="group relative flex flex-col items-center gap-3 p-5 rounded-lg glass-card cursor-default"
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.04 }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ boxShadow: `0 0 30px ${tech.color}30, inset 0 0 0 1px ${tech.color}40` }}
      />

      {/* Icon */}
      <motion.div
        className="w-12 h-12 relative z-10"
        dangerouslySetInnerHTML={{ __html: tech.svg }}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      />

      {/* Name */}
      <div className="relative z-10 text-center">
        <p
          className="text-sm font-semibold text-text-primary group-hover:text-opacity-100 transition-colors"
          style={{ color: `color-mix(in srgb, ${tech.color} 60%, var(--text-primary) 40%)` }}
        >
          {tech.name}
        </p>
        <p className="text-xs text-text-muted mt-0.5 font-mono">{tech.category}</p>
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <section id="stack" className="py-28 relative overflow-hidden">
      {/* BG accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_50%_50%,rgba(124,92,252,0.05),transparent)] pointer-events-none" />

      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">
            <span className="text-accent-primary">03.</span>&nbsp;Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-4">
            Tools of the{" "}
            <span className="gradient-text">Trade</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            A curated set of technologies I reach for to build fast, scalable, and maintainable systems.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {techStack.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
