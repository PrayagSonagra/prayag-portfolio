"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Plus, Trash2, Info, Zap } from "lucide-react";

type NodeData = {
  id: string;
  label: string;
  type: "input" | "process" | "decision" | "output";
  x: number;
  y: number;
};

type EdgeData = {
  from: string;
  to: string;
};

const NODE_COLORS: Record<NodeData["type"], { bg: string; border: string; text: string; label: string }> = {
  input: { bg: "rgba(34,211,238,0.15)", border: "#22d3ee", text: "#22d3ee", label: "Input" },
  process: { bg: "rgba(124,92,252,0.15)", border: "#7c5cfc", text: "#a78bfa", label: "Process" },
  decision: { bg: "rgba(245,158,11,0.15)", border: "#f59e0b", text: "#f59e0b", label: "Decision" },
  output: { bg: "rgba(16,185,129,0.15)", border: "#10b981", text: "#10b981", label: "Output" },
};

const INITIAL_NODES: NodeData[] = [
  { id: "n1", label: "User Message", type: "input", x: 60, y: 80 },
  { id: "n2", label: "NLP Parse", type: "process", x: 260, y: 60 },
  { id: "n3", label: "Intent Check", type: "decision", x: 460, y: 80 },
  { id: "n4", label: "Generate Reply", type: "process", x: 360, y: 220 },
  { id: "n5", label: "Send Response", type: "output", x: 560, y: 220 },
];

const INITIAL_EDGES: EdgeData[] = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n4" },
  { from: "n4", to: "n5" },
];

const NODE_W = 140;
const NODE_H = 52;

export default function LogicPlayground() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);
  const [edges] = useState<EdgeData[]>(INITIAL_EDGES);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  const getCenterX = (n: NodeData) => n.x + NODE_W / 2;
  const getCenterY = (n: NodeData) => n.y + NODE_H / 2;

  const getBezierPath = (from: NodeData, to: NodeData) => {
    const x1 = getCenterX(from);
    const y1 = getCenterY(from);
    const x2 = getCenterX(to);
    const y2 = getCenterY(to);
    const cx = (x1 + x2) / 2;
    return `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
  };

  const onMouseDown = useCallback(
    (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      setDragging(nodeId);
      setActiveNode(nodeId);
      setDragOffset({ x: e.clientX - rect.left - node.x, y: e.clientY - rect.top - node.y });
    },
    [nodes]
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width - NODE_W, e.clientX - rect.left - dragOffset.x));
      const y = Math.max(0, Math.min(rect.height - NODE_H, e.clientY - rect.top - dragOffset.y));
      setNodes((prev) => prev.map((n) => (n.id === dragging ? { ...n, x, y } : n)));
    },
    [dragging, dragOffset]
  );

  const onMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const addNode = () => {
    const types: NodeData["type"][] = ["input", "process", "decision", "output"];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = `n${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      { id, label: `${NODE_COLORS[type].label} ${prev.length + 1}`, type, x: 100 + Math.random() * 300, y: 50 + Math.random() * 200 },
    ]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (activeNode === id) setActiveNode(null);
  };

  const canvasWidth = 760;
  const canvasHeight = 320;

  return (
    <section id="playground" className="py-28 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_80%,rgba(34,211,238,0.05),transparent)] pointer-events-none" />

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
            <span className="text-accent-primary">04.</span>&nbsp;Playground
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mt-4">
            Logic{" "}
            <span className="gradient-text">Playground</span>
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl mx-auto">
            An interactive node-link canvas demonstrating visual builder expertise.
            Drag nodes to re-architect the flow.
          </p>
        </motion.div>

        {/* Canvas */}
        <motion.div
          className="glass-card rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Toolbar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-primary" />
              <span className="font-mono text-sm font-semibold text-text-secondary">
                flow-canvas.tsx
              </span>
              <span className="font-mono text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded">
                {nodes.length} nodes · {edges.length} edges
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="playground-add-node"
                onClick={addNode}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-accent-primary/15 text-accent-secondary border border-accent-primary/30 hover:bg-accent-primary/25 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Node
              </button>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Info className="w-3.5 h-3.5" />
                Drag to move
              </div>
            </div>
          </div>

          {/* Canvas area */}
          <div
            ref={canvasRef}
            id="playground-canvas"
            className="relative overflow-hidden select-none"
            style={{
              height: canvasHeight,
              background: "repeating-linear-gradient(var(--bg-elevated) 0px, var(--bg-elevated) 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, var(--bg-elevated) 0px, var(--bg-elevated) 1px, transparent 1px, transparent 40px)",
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0",
              cursor: dragging ? "grabbing" : "default",
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
          >
            {/* SVG edges */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgba(124,92,252,0.7)" />
                </marker>
                <filter id="edge-glow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {edges.map((edge) => {
                const fromNode = getNodeById(edge.from);
                const toNode = getNodeById(edge.to);
                if (!fromNode || !toNode) return null;
                return (
                  <path
                    key={`${edge.from}-${edge.to}`}
                    d={getBezierPath(fromNode, toNode)}
                    stroke="rgba(124,92,252,0.55)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="0"
                    markerEnd="url(#arrowhead)"
                    filter="url(#edge-glow)"
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const colors = NODE_COLORS[node.type];
              const isActive = activeNode === node.id;
              return (
                <motion.div
                  key={node.id}
                  id={`node-${node.id}`}
                  className="absolute rounded-xl flex items-center justify-between px-3 gap-2 group"
                  style={{
                    left: node.x,
                    top: node.y,
                    width: NODE_W,
                    height: NODE_H,
                    background: colors.bg,
                    border: `1.5px solid ${isActive ? colors.border : colors.border + "70"}`,
                    boxShadow: isActive ? `0 0 20px ${colors.border}40` : "none",
                    cursor: dragging === node.id ? "grabbing" : "grab",
                    zIndex: dragging === node.id ? 20 : 10,
                    transition: dragging === node.id ? "none" : "box-shadow 0.2s, border-color 0.2s",
                  }}
                  layout
                  onMouseDown={(e) => onMouseDown(e, node.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: colors.border + "cc" }}>
                      {colors.label}
                    </div>
                    <div className="text-xs font-semibold text-text-primary truncate leading-tight">
                      {node.label}
                    </div>
                  </div>
                  <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/20"
                    onClick={(e) => { e.stopPropagation(); removeNode(node.id); }}
                    aria-label="Remove node"
                  >
                    <Trash2 className="w-3 h-3 text-red-400" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 px-5 py-3 border-t border-border-subtle">
            {Object.entries(NODE_COLORS).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors.border }} />
                <span className="text-xs text-text-muted font-mono capitalize">{type}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
