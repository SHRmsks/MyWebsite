"use client";
import React, { useEffect, useRef } from "react";

const CYAN = "#05d9e8";
const YELLOW = "#FCEE0A";
const PINK = "#ff2d8d";
const GRID_COLOR = "rgba(57, 196, 182, 0.1)";

export default function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, animationFrameId;

    const mouse = { x: -1000, y: -1000, active: false };

    // --- 1. NEURAL NODE NETWORK SETUP ---
    const particles = [];
    const NUM_PARTICLES = 110;

    // --- 2. SLOW DATA PILLARS SETUP ---
    const pillars = [];
    const NUM_PILLARS = 25;
    const hexChars = "0123456789ABCDEF";

    // --- 3. KERNEL TELEMETRY LOGS ---
    const termLogs = [
      "[OK] ALLOC struct node wait_nodes[10]",
      "[OK] INIT mygit_chunk_def_hash",
      "[WARN] GO_SLICE_HEADER: 24_BYTES",
      "[SYS] std::priority_queue // MAX_HEAP",
      "[OK] MOUNT CUSTOM_FS RING_3",
      "[SYS] BYPASS_SYSCALL_OVERRIDE",
      "[OK] LOAD MICROS_MONOTONIC_SCHEDULER",
    ];
    let currentLog = 0;
    let lastLogTime = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;

      // Re-seed nodes
      particles.length = 0;
      for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          radius: Math.random() * 1.5 + 0.5,
          color: Math.random() > 0.2 ? CYAN : YELLOW,
        });
      }

      // Re-seed data pillars
      pillars.length = 0;
      for (let i = 0; i < NUM_PILLARS; i++) {
        pillars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          speed: Math.random() * 0.5 + 0.2, // Very slow
          chars: Array.from(
            { length: 15 },
            () => hexChars[Math.floor(Math.random() * 16)],
          ),
        });
      }
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });
    window.addEventListener("mouseleave", () => (mouse.active = false));
    resize();

    // Mathematically accurate PQRST heartbeat waveform
    const getEKG = (t) => {
      const cycle = (t * 1.2) % 1.0;
      if (cycle < 0.15) return 0; // Flat
      if (cycle < 0.25) return Math.sin((cycle - 0.15) * Math.PI * 10) * 12; // P-wave
      if (cycle < 0.35) return 0; // PR Segment
      if (cycle < 0.38) return -10; // Q-wave
      if (cycle < 0.43) return 55; // R-spike
      if (cycle < 0.48) return -20; // S-wave
      if (cycle < 0.55) return 0; // ST Segment
      if (cycle < 0.75) return Math.sin((cycle - 0.55) * Math.PI * 5) * 18; // T-wave
      return 0; // Flat
    };

    const draw = () => {
      const time = Date.now() * 0.001;

      // Smooth fade for motion blur
      ctx.fillStyle = "rgba(5, 7, 13, 0.25)";
      ctx.fillRect(0, 0, w, h);

      // --- LAYER 1: DATA PILLARS (Slower Matrix) ---
      ctx.font = "12px monospace";
      pillars.forEach((p) => {
        p.y += p.speed;
        if (p.y > h + 200) p.y = -200;

        // Randomly flip characters occasionally
        if (Math.random() < 0.02) {
          p.chars[Math.floor(Math.random() * p.chars.length)] =
            hexChars[Math.floor(Math.random() * 16)];
        }

        p.chars.forEach((char, index) => {
          const charY = p.y - index * 16;
          const opacity = 1 - index / p.chars.length;
          ctx.fillStyle = `rgba(57, 196, 182, ${opacity * 0.15})`;
          ctx.fillText(char, p.x, charY);
        });
      });

      // --- LAYER 2: NEURAL NODE NETWORK ---
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];

        // Kinematics
        p.x += p.vx;
        p.y += p.vy;

        // Wraparound bounds
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse Magnetic Repulsion
        if (mouse.active) {
          let dx = p.x - mouse.x;
          let dy = p.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.x += (dx / dist) * force * 3;
            p.y += (dy / dist) * force * 3;
          }
        }

        // Draw Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect proximity webs
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let distSq = dx * dx + dy * dy;

          if (distSq < 15000) {
            let opacity = 1 - Math.sqrt(distSq) / 122;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(57, 196, 182, ${opacity * 0.4})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      // --- LAYER 3: MEDICAL DIAGNOSTIC HUD ---

      // A. EKG Monitor Box (Top Left)
      const ekgX = 30,
        ekgY = 110,
        ekgW = 300,
        ekgH = 90;

      // 1. Grid Line Opacity: extremely faint (0.04)
      ctx.strokeStyle = "rgba(57, 196, 182, 0.04)";
      ctx.lineWidth = 1;
      ctx.strokeRect(ekgX, ekgY, ekgW, ekgH);

      // Draw Grid lines inside EKG box
      ctx.beginPath();
      for (let i = 10; i < ekgW; i += 10) {
        ctx.moveTo(ekgX + i, ekgY);
        ctx.lineTo(ekgX + i, ekgY + ekgH);
      }
      for (let i = 10; i < ekgH; i += 10) {
        ctx.moveTo(ekgX, ekgY + i);
        ctx.lineTo(ekgX + ekgW, ekgY + i);
      }
      ctx.stroke();

      // Draw PQRST Wave
      ctx.beginPath();

      // 2. Wave Opacity: dropped to 40% (0.4)
      ctx.strokeStyle = "rgba(255, 45, 141, 0.4)";
      ctx.lineWidth = 1.5;
      for (let x = 0; x < ekgW; x += 2) {
        const t = time + x * 0.005;
        const yOffset = getEKG(t);
        const noise = (Math.random() - 0.5) * 1.5;
        if (x === 0) ctx.moveTo(ekgX + x, ekgY + ekgH / 2 - yOffset + noise);
        else ctx.lineTo(ekgX + x, ekgY + ekgH / 2 - yOffset + noise);
      }
      ctx.stroke();

      // EKG Labels

      // 3. Pink Text Opacity: dropped to 50% (0.5)
      ctx.fillStyle = "rgba(255, 45, 141, 0.5)";
      ctx.font = "10px monospace";
      ctx.fillText("BPM: 72  V: NORMAL", ekgX + 5, ekgY - 8);

      // B. System Kernel Logs (Top Right)
      if (time - lastLogTime > 1.8) {
        currentLog = (currentLog + 1) % termLogs.length;
        lastLogTime = time;
      }
      const logX = w - 30;
      const logY = 110;

      // 4. Yellow Logs Opacity: dropped to 35% (0.35)
      ctx.fillStyle = "rgba(252, 238, 10, 0.35)";
      ctx.textAlign = "right";
      ctx.font = "11px monospace";
      ctx.fillText(`SYS_DIAG // RUNNING`, logX, logY);
      ctx.fillText(termLogs[currentLog], logX, logY + 20);

      // 5. Cyan Memory Logs Opacity: dropped to 25% (0.25)
      ctx.fillStyle = "rgba(57, 196, 182, 0.25)";
      ctx.fillText(
        `MEM_PTR: 0x${(Math.random() * 0xffffffffff).toString(16).toUpperCase()}`,
        logX,
        logY + 40,
      );
      ctx.textAlign = "left"; // reset

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", null);
      window.removeEventListener("mouseleave", null);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 bg-[#05070d]"
    />
  );
}
