"use client";

import { useRef, useEffect } from "react";
import { CW_AGENT_COLORS } from "@/lib/constants/copywrite";
import type { CWAgentKey, CWAgentStatus } from "@/types/copywrite";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

interface Props {
  agentStatuses: Record<CWAgentKey, CWAgentStatus>;
  width?: number;
  height?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export default function DNAHelixCanvas({
  agentStatuses,
  width = 200,
  height = 400,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set up high-DPI canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const completedAgents = AGENT_KEYS.filter(
      (k) => agentStatuses[k] === "done"
    );
    const runningAgent = AGENT_KEYS.find(
      (k) => agentStatuses[k] === "running"
    );
    const progress = completedAgents.length / AGENT_KEYS.length;

    function spawnBurst(color: string, y: number) {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        particlesRef.current.push({
          x: width / 2,
          y,
          vx: Math.cos(angle) * (1.5 + Math.random()),
          vy: Math.sin(angle) * (1.5 + Math.random()),
          life: 0,
          maxLife: 40 + Math.random() * 20,
          color,
          size: 1.5 + Math.random() * 1.5,
        });
      }
    }

    // Spawn bursts for newly completed agents
    completedAgents.forEach((key, i) => {
      const y = (height * (i + 1)) / (AGENT_KEYS.length + 1);
      if (particlesRef.current.length < 50) {
        spawnBurst(CW_AGENT_COLORS[key].hex, y);
      }
    });

    function animate() {
      if (!ctx) return;
      timeRef.current += 0.02;
      const t = timeRef.current;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Helix parameters
      const amplitude = 40;
      const cx = width / 2;
      const fillHeight = height * progress;
      const steps = 80;

      // Draw helix strands
      for (let i = 0; i < steps; i++) {
        const y = (height * i) / steps;
        const phase = t * 2 + (y / height) * Math.PI * 4;

        const x1 = cx + Math.sin(phase) * amplitude;
        const x2 = cx - Math.sin(phase) * amplitude;

        // Determine color based on which agent section
        const sectionIndex = Math.floor(
          (i / steps) * AGENT_KEYS.length
        );
        const agentKey = AGENT_KEYS[Math.min(sectionIndex, AGENT_KEYS.length - 1)];
        const agentColor = CW_AGENT_COLORS[agentKey];
        const agentStatus = agentStatuses[agentKey];

        const isFilled = y < fillHeight;
        const isRunning = agentStatus === "running";

        const alpha = isFilled ? 0.8 : isRunning ? 0.3 + Math.sin(t * 4) * 0.15 : 0.06;

        // Strand 1
        ctx.beginPath();
        ctx.arc(x1, y, isFilled ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${agentColor.rgb},${alpha})`;
        ctx.fill();

        // Strand 2
        ctx.beginPath();
        ctx.arc(x2, y, isFilled ? 2.5 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${agentColor.rgb},${alpha})`;
        ctx.fill();

        // Cross-links (every 8 steps)
        if (i % 8 === 0 && isFilled) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `rgba(${agentColor.rgb},0.15)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;

        const lifeRatio = 1 - p.life / p.maxLife;
        if (lifeRatio <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = lifeRatio * 0.6;
        ctx.fill();
        ctx.globalAlpha = 1;

        return true;
      });

      // Cosmic dust
      if (runningAgent) {
        const dustColor = CW_AGENT_COLORS[runningAgent];
        for (let i = 0; i < 2; i++) {
          const x = Math.random() * width;
          const y = Math.random() * height;
          const size = Math.random() * 1.2;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${dustColor.rgb},${0.05 + Math.random() * 0.1})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [agentStatuses, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="block"
    />
  );
}
