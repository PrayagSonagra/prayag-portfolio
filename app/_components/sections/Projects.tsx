"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, GitBranch, Brain, Workflow, MessageSquare, Layers } from "lucide-react";

const projects = [
  {
    id: "whatsapp-crm",
    title: "WhatsApp CRM",
    subtitle: "Enterprise Messaging & Automation Platform",
    description:
      "Enterprise-grade CRM for WhatsApp Business — multi-agent inbox, broadcast campaigns, automated workflows, and real-time message sync via Socket.io.",
    longDesc:
      "A full-scale SaaS CRM built at Hellofy LLC. Handles thousands of concurrent users with a visual chatbot flow builder, WhatsApp template management, role-based access, and a trigger-condition-action automation engine — all synced in real time.",
    icon: MessageSquare,
    accentColor: "var(--accent-emerald)",
    glowColor: "rgba(16,185,129,0.3)",
    tags: ["Socket.io", "Node.js", "MongoDB", "React", "Redux Toolkit", "WhatsApp API", "TypeScript"],
    features: [
      "Broadcasting & campaign manager",
      "WhatsApp template builder",
      "Automated response engine",
      "Visual chatbot flow builder",
      "API calls inside chatbot flows",
      "Role-based access control",
      "Ticket & conversation management",
      "User & role management",
      "Real-time multi-agent inbox",
    ],
    github: "#",
    demo: "#",
    size: "large",
    gradient: "from-[#10b981]/20 via-[#10b981]/08 to-transparent",
  },
  {
    id: "voca",
    title: "Voca",
    subtitle: "AI-Powered PDF & Voice Intelligence",
    description:
      "An intelligent library where you can chat with your PDFs or interact via real-time voice—powered by a custom RAG pipeline and Vapi AI integration.",
    longDesc:
      "Voca transforms static documents into interactive knowledge bases. Using MongoDB for data persistence and Vercel Blob for secure storage, it processes PDFs to enable contextual AI conversations and hands-free voice interactions.",
    icon: Brain,
    accentColor: "var(--accent-primary)",
    glowColor: "rgba(124,92,252,0.3)",
    // Updated tags to match your actual dependencies
    tags: ["Next.js", "MongoDB", "Vapi AI", "OpenAI", "Vercel Blob", "Clerk"],
    features: [
      "Real-time voice interaction via Vapi AI integration",
      "RAG pipeline with semantic PDF processing",
      "Secure document storage with Vercel Blob",
      "Authentication & User Management via Clerk",
      "Responsive UI built with Tailwind CSS 4 & Shadcn",
    ],
    github: "https://github.com/prayagsonagra",
    demo: "#",
    size: "medium",
    gradient: "from-[#7c5cfc]/20 via-[#a78bfa]/10 to-transparent",
  },
  {
    id: "chatbot-builder",
    title: "Visual Chatbot Builder",
    subtitle: "Drag-and-Drop Flow Editor",
    description:
      "A node-based visual editor for building complex chatbot conversation flows. Powered by React Flow for the canvas and @dnd-kit for state management.",
    longDesc:
      "Inspired by tools like n8n and Typebot — drag nodes to build conversation logic, connect decision branches, and export flows as executable JSON state machines.",
    icon: Workflow,
    accentColor: "var(--accent-cyan)",
    glowColor: "rgba(34,211,238,0.3)",
    tags: ["React Flow", "@dnd-kit", "React", "TypeScript", "Zustand"],
    features: [
      "Infinite canvas with minimap",
      "Drag-and-drop node palette",
      "Live flow preview & validation",
      "JSON export for bot engine",
    ],
    github: "#",
    demo: "#",
    size: "medium",
    gradient: "from-[#22d3ee]/20 via-[#22d3ee]/05 to-transparent",
  },
];


function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = project.icon;

  const isLarge = project.size === "large";

  return (
    <motion.div
      ref={ref}
      id={`project-${project.id}`}
      className={`glass-card rounded-xl overflow-hidden group cursor-default relative ${isLarge ? "md:col-span-2" : "col-span-1"
        }`}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      {/* Gradient accent background */}
      <div
        className={`absolute inset-0 bg-linear-to-br ${project.gradient} opacity-60 pointer-events-none transition-opacity duration-500 group-hover:opacity-100`}
      />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${project.accentColor}`, filter: `drop-shadow(0 0 20px ${project.glowColor})` }}
      />

      <div className={`relative z-10 p-6 ${isLarge ? "md:p-8" : ""}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: `${project.accentColor}20`, border: `1px solid ${project.accentColor}40` }}
          >
            <Icon className="w-5 h-5" style={{ color: project.accentColor }} strokeWidth={1.8} />
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {project.github !== "#" && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} GitHub`}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-elevated hover:bg-bg-overlay transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <GitBranch className="w-3.5 h-3.5 text-text-secondary" />
              </a>
            )}
            {/* <a
              href={project.demo}
              aria-label={`${project.title} demo`}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-bg-elevated hover:bg-bg-overlay transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5 text-text-secondary" />
            </a> */}
          </div>
        </div>

        {/* Title */}
        <div className="mb-3">
          <h3 className={`font-bold text-text-primary leading-tight ${isLarge ? "text-2xl md:text-3xl" : "text-xl"}`}>
            {project.title}
          </h3>
          <p className="text-sm font-medium mt-1" style={{ color: project.accentColor }}>
            {project.subtitle}
          </p>
        </div>

        {/* Description */}
        <p className={`text-text-secondary leading-relaxed mb-5 ${isLarge ? "text-base" : "text-sm"}`}>
          {isLarge ? project.longDesc : project.description}
        </p>

        {/* Feature list (large card only) */}
        {isLarge && (
          <div className="grid grid-cols-2 gap-2 mb-6 sm:grid-cols-3">
            {project.features.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg border"
                style={{
                  color: project.accentColor,
                  borderColor: `${project.accentColor}35`,
                  background: `${project.accentColor}0d`,
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: project.accentColor }} />
                {f}
              </span>
            ))}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs px-2.5 py-1 rounded-lg bg-bg-overlay text-text-muted border border-border-subtle"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_30%,rgba(124,92,252,0.07),transparent)] pointer-events-none" />

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
            <span className="text-accent-primary">02.</span>&nbsp;Projects
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-4">
            Things I've{" "}
            <span className="gradient-text">Built</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            Real products, real users. From AI libraries to enterprise CRMs.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
