"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, GraduationCap, Rocket, MapPin, ExternalLink } from "lucide-react";

const experiences = [
  {
    id: "gtu",
    type: "education",
    icon: GraduationCap,
    period: "2019 — 2023",
    role: "B.E. Computer Engineering",
    company: "Gujarat Technological University",
    location: "Ahmedabad, India",
    color: "var(--accent-cyan)",
    highlights: [
      "Graduated with focus on software engineering",
      "Final year project: Real-time cryptocurrency market tracker with live watchlist",
    ],
    tags: ["JavaScript", "React", "Next.js", "Node.js", "MongoDB", "TailwindCSS"],
  },
  // {
  //   id: "freelance",
  //   type: "work",
  //   icon: Rocket,
  //   period: "2023 — 2024",
  //   role: "Freelance Full Stack Developer",
  //   company: "Independent / Remote",
  //   location: "Remote",
  //   color: "var(--accent-amber)",
  //   highlights: [
  //     "Delivered 5+ client projects — SaaS dashboards, e-commerce, REST APIs",
  //     "Built Visual Chatbot Builder: drag-and-drop node editor with React Flow",
  //     "Developed Voca — AI-powered PDF library with RAG pipeline using OpenAI",
  //   ],
  //   tags: ["React", "Next.js", "Node.js", "PostgreSQL", "OpenAI", "ReactFlow"],
  // },
  {
    id: "hellofy",
    type: "work",
    icon: Briefcase,
    period: "2023 — Present",
    role: "Full Stack Engineer",
    company: "Hellofy LLC",
    location: "Ahmedabad, India",
    color: "var(--accent-primary)",
    highlights: [
      "Architected a scalable WhatsApp CRM featuring a multi-agent inbox and automated broadcast systems.",
      "Engineered a real-time messaging layer with Socket.io, handling 10k+ concurrent WebSocket connections.",
      "Developed a visual automation engine using a trigger-condition-action model for complex message workflows.",
      "Integrated multi-channel communication via WhatsApp Business AP",
    ],
    tags: ["React", "Node.js", "Socket.io", "MongoDB", "WhatsApp API", "TypeScript", "Redux Toolkit"],
  },
];

function TimelineCard({
  exp,
  index,
}: {
  exp: (typeof experiences)[0];
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = exp.icon;

  return (
    <motion.div
      ref={ref}
      className="relative pl-12 md:pl-16"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-6 w-10 h-10 rounded-full flex items-center justify-center border-2 border-bg-base shadow-lg z-10"
        style={{
          background: `linear-gradient(135deg, ${exp.color}, ${exp.color}88)`,
          boxShadow: `0 0 20px ${exp.color}40`,
        }}
      >
        <Icon className="w-4.5 h-4.5 text-white" strokeWidth={2} />
      </div>

      {/* Card */}
      <div className="glass-card rounded-lg p-6 glass-card-hover cursor-default">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  color: exp.color,
                  background: `${exp.color}18`,
                  border: `1px solid ${exp.color}35`,
                }}
              >
                {exp.period}
              </span>
              {exp.id === "hellofy" && (
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30">
                  Current
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-text-primary leading-tight">
              {exp.role}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium" style={{ color: exp.color }}>
                {exp.company}
              </span>
              <span className="text-text-muted">·</span>
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <MapPin className="w-3 h-3" />
                {exp.location}
              </span>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <ul className="space-y-2 mb-4">
          {exp.highlights.map((h, i) => (
            <motion.li
              key={i}
              className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.3 + i * 0.08 }}
            >
              <span
                className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: exp.color }}
              />
              {h}
            </motion.li>
          ))}
        </ul>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs px-2.5 py-1 rounded-lg bg-bg-elevated text-text-muted border border-border-subtle"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const lineRef = useRef<SVGLineElement>(null);
  const sectionRef = useRef(null);
  const isSectionInView = useInView(sectionRef, { once: true });

  return (
    <section id="experience" ref={sectionRef} className="py-28 relative">
      {/* Subtle bg accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_60%,rgba(34,211,238,0.05),transparent)] pointer-events-none" />

      <div className="section-container">
        {/* Section header */}
        <motion.div
          ref={titleRef}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">
            <span className="text-accent-primary">01.</span>&nbsp;Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-4">
            Experience &{" "}
            <span className="gradient-text">Education</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            From university labs to production systems serving thousands of users.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line with draw animation */}
          <div className="absolute left-5 top-6 bottom-6 w-px overflow-hidden">
            <motion.div
              className="w-full origin-top"
              style={{
                background: "linear-gradient(to bottom, var(--accent-primary), var(--accent-cyan), transparent)",
              }}
              initial={{ scaleY: 0 }}
              animate={isSectionInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Cards */}
          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <TimelineCard key={exp.id} exp={exp} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
