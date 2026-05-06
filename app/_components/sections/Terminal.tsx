"use client";

import { useRef, useState, useEffect, useCallback, KeyboardEvent } from "react";
import { motion, useInView } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
type LineKind = "cmd" | "out" | "blank" | "error";
interface Line {
  kind: LineKind;
  text: string;
  color?: string;
}

// ─── Command responses ────────────────────────────────────────────────────────
const RESPONSES: Record<string, Line[]> = {
  help: [
    { kind: "out", text: "Available commands:", color: "#a78bfa" },
    { kind: "blank", text: "" },
    { kind: "out", text: "  whoami      →  About me" },
    { kind: "out", text: "  skills      →  Tech stack & tools" },
    { kind: "out", text: "  projects    →  Things I've shipped" },
    { kind: "out", text: "  experience  →  Career journey" },
    { kind: "out", text: "  contact     →  Get in touch" },
    { kind: "out", text: "  clear       →  Clear the terminal" },
    { kind: "blank", text: "" },
    { kind: "out", text: "  Tip: use ↑ / ↓ to navigate history", color: "#6b7280" },
  ],

  whoami: [
    { kind: "out", text: "Prayag Sonagra", color: "#e2e8f0" },
    { kind: "out", text: "Full Stack Engineer", color: "#a78bfa" },
    { kind: "blank", text: "" },
    { kind: "out", text: "  📍  Ahmedabad, India" },
    { kind: "out", text: "  🏢  Full Stack Engineer @ Hellofy LLC" },
    { kind: "out", text: "  🎓  Gujarat Technological University, 2019–2023" },
    { kind: "blank", text: "" },
    { kind: "out", text: "  Specialising in real-time systems, enterprise CRMs," },
    { kind: "out", text: "  AI-powered applications & visual builder tools." },
  ],

  skills: [
    { kind: "out", text: "── Frontend ─────────────────────────────", color: "#22d3ee" },
    { kind: "out", text: "  React · Next.js · TypeScript · Tailwind CSS · Redux Toolkit" },
    { kind: "blank", text: "" },
    { kind: "out", text: "── Backend ──────────────────────────────", color: "#22d3ee" },
    { kind: "out", text: "  Node.js · Express · REST APIs · Socket.io" },
    { kind: "blank", text: "" },
    { kind: "out", text: "── Database & Infra ──────────────────────", color: "#22d3ee" },
    { kind: "out", text: "  MongoDB · PostgreSQL · Prisma" },
    { kind: "blank", text: "" },
    { kind: "out", text: "── Tools ────────────────────────────────", color: "#22d3ee" },
    { kind: "out", text: "  Git · Vercel · Postman · React Flow" },
  ],

  projects: [
    { kind: "out", text: "── WhatsApp CRM ─────────────────────────", color: "#10b981" },
    { kind: "out", text: "  Enterprise messaging platform @ Hellofy LLC" },
    { kind: "out", text: "  · Visual chatbot flow builder with API call nodes" },
    { kind: "out", text: "  · 10k+ concurrent WebSocket connections via Socket.io" },
    { kind: "out", text: "  · Broadcasting, templates, RBAC, ticket management" },
    { kind: "out", text: "  Stack: React · Node.js · MongoDB · Socket.io · WhatsApp API" },
    { kind: "blank", text: "" },
    { kind: "out", text: "── Voca ─────────────────────────────────", color: "#7c5cfc" },
    { kind: "out", text: "  AI-powered PDF knowledge base & Voice Assistant" },
    { kind: "out", text: "  · RAG pipeline with PDF processing and semantic analysis" },
    { kind: "out", text: "  · Real-time voice interaction via Vapi AI integration" },
    { kind: "out", text: "  · Secure document storage and Clerk authentication" },
    { kind: "out", text: "  Stack: Next.js · MongoDB · Vercel Blob · Vapi · Tailwind CSS" },
    { kind: "out", text: "── Visual Chatbot Builder ───────────────", color: "#22d3ee" },
    { kind: "out", text: "  Drag-and-drop node editor for conversation flows" },
    { kind: "out", text: "  · Infinite canvas · Live preview · JSON export" },
    { kind: "out", text: "  Stack: React Flow · @dnd-kit · TypeScript · Zustand" },
  ],

  experience: [
    { kind: "out", text: "── 2019 – 2023 ──────────────────────────", color: "#f59e0b" },
    { kind: "out", text: "  Gujarat Technological University" },
    { kind: "out", text: "  B.E. Computer Engineering" },
    { kind: "out", text: "  · Built a real-time stock market dashboard with live stock data" },
    { kind: "blank", text: "" },
    { kind: "out", text: "── 2023 – Present ───────────────────────", color: "#7c5cfc" },
    { kind: "out", text: "  Full Stack Engineer @ Hellofy LLC", color: "#e2e8f0" },
    { kind: "out", text: "  · Architected scalable WhatsApp CRM with multi-agent inbox" },
    { kind: "out", text: "  · Built real-time layer handling 10k+ concurrent connections" },
    { kind: "out", text: "  · Developed visual automation engine (trigger→condition→action)" },
    { kind: "out", text: "  · Reduced p95 API response time by 85% via DB optimisation" },
  ],

  contact: [
    { kind: "out", text: "── Let's connect ────────────────────────", color: "#a78bfa" },
    { kind: "blank", text: "" },
    { kind: "out", text: "  📧  sonagraprayag2@gmail.com" },
    { kind: "out", text: "  💼  linkedin.com/in/prayagsonagra" },
    { kind: "out", text: "  🐙  github.com/prayagsonagra" },
    { kind: "blank", text: "" },
    { kind: "out", text: "  ● Available for full-time roles & contracts", color: "#10b981" },
    { kind: "out", text: "    Response within 24 hours.", color: "#10b981" },
  ],
};

// ─── Boot sequence (auto-typed on mount) ─────────────────────────────────────
const BOOT: Array<{ isCmd: boolean; text: string }> = [
  { isCmd: false, text: "Initialising prayag.dev terminal..." },
  { isCmd: false, text: "" },
  { isCmd: true, text: "whoami" },
  { isCmd: false, text: "" },
];

const PROMPT = "prayag@dev:~$";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function lineColor(kind: LineKind, color?: string): string {
  if (color) return color;
  if (kind === "cmd") return "#e2e8f0";
  if (kind === "error") return "#f87171";
  return "#94a3b8";
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Terminal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-80px" });

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bootedRef = useRef(false);       // ref so it never triggers effect re-run
  const [typing, setTyping] = useState(false);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  // ── Run a command and append its output ────────────────────────────────────
  const runCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === "clear") {
      setLines([]);
      return;
    }

    const response = RESPONSES[trimmed] ?? [
      { kind: "error" as LineKind, text: `command not found: ${trimmed}` },
      { kind: "out" as LineKind, text: "Type 'help' to see available commands.", color: "#6b7280" },
    ];

    setLines(prev => [
      ...prev,
      { kind: "cmd", text: cmd },
      ...response,
      { kind: "blank", text: "" },
    ]);
  }, []);

  // ── Boot sequence ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isTitleInView || bootedRef.current) return;
    bootedRef.current = true;   // mutate ref — no re-render, no cleanup re-fire
    setTyping(true);

    let cancelled = false;
    (async () => {
      for (const step of BOOT) {
        if (cancelled) return;
        if (!step.text) {
          setLines(prev => [...prev, { kind: "blank", text: "" }]);
          await delay(120);
          continue;
        }
        if (step.isCmd) {
          let partial = "";
          for (const ch of step.text) {
            if (cancelled) return;
            partial += ch;
            setInput(partial);
            await delay(55 + Math.random() * 30);
          }
          await delay(320);
          setInput("");
          runCommand(step.text);
          await delay(180);
        } else {
          setLines(prev => [...prev, { kind: "out", text: step.text, color: "#6b7280" }]);
          await delay(200);
        }
      }
      if (!cancelled) {
        setTyping(false);
        setTimeout(() => inputRef.current?.focus(), 80);
      }
    })();

    return () => { cancelled = true; };
  }, [isTitleInView, runCommand]);   // booted removed — using ref instead

  // ── Handle input submit ───────────────────────────────────────────────────
  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = input.trim();
      if (cmd) {
        setHistory(h => [cmd, ...h]);
        setHistIdx(-1);
        runCommand(cmd);
      }
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? "" : (history[next] ?? ""));
    }
  };

  return (
    <section id="terminal" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,92,252,0.07),transparent)] pointer-events-none" />

      <div className="section-container">
        {/* Header */}
        <motion.div
          ref={titleRef}
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label mb-4 inline-flex">
            <span className="text-accent">04.</span>&nbsp;Terminal
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-4">
            Ask Me{" "}
            <span className="gradient-text">Anything</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            An interactive terminal — type a command or explore with{" "}
            <code className="font-mono text-accent-light bg-bg-elevated px-1.5 py-0.5 rounded text-sm">help</code>.
          </p>
        </motion.div>

        {/* Terminal window */}
        <motion.div
          ref={sectionRef}
          className="max-w-3xl mx-auto glass-card rounded-xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-bg-elevated border-b border-border-subtle select-none">
            {/* Traffic lights */}
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="mx-auto font-mono text-xs text-text-muted">
              terminal — prayag@dev
            </span>
          </div>

          {/* Output area */}
          <div
            ref={bodyRef}
            className="h-105 overflow-y-auto px-5 py-4 font-mono text-sm leading-relaxed scroll-smooth"
            style={{ background: "var(--bg-base)" }}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className="whitespace-pre-wrap wrap-break-word"
                style={{ color: lineColor(line.kind, line.color) }}
              >
                {line.kind === "cmd" && (
                  <>
                    <span className="text-accent-emerald select-none">{PROMPT} </span>
                    {line.text}
                  </>
                )}
                {line.kind !== "cmd" && line.text}
              </div>
            ))}

            {/* Live prompt with real focusable input */}
            <div className="flex items-center">
              <span className="text-accent-emerald shrink-0 select-none mr-1.5">{PROMPT}</span>
              {typing ? (
                <span className="text-text-primary">{input}<span className="inline-block w-2 h-4 bg-accent-primary ml-0.5 animate-pulse align-middle" /></span>
              ) : (
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent outline-none border-none text-text-primary font-mono text-sm caret-accent-primary min-w-0"
                  aria-label="Terminal input"
                  autoComplete="off"
                  spellCheck={false}
                />
              )}
            </div>
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-border-subtle bg-bg-elevated">
            <span className="font-mono text-xs text-text-muted">
              {typing ? "⟳ loading..." : "click anywhere to focus"}
            </span>
            <div className="flex gap-3 font-mono text-xs text-text-muted">
              {["help", "whoami", "projects", "contact"].map(cmd => (
                <button
                  key={cmd}
                  className="hover:text-accent-secondary transition-colors"
                  onClick={e => { e.stopPropagation(); if (!typing) { setInput(""); runCommand(cmd); } }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function delay(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}
