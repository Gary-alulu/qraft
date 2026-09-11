"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────
   Confetti colours drawn from Qraft's palette
───────────────────────────────────────────── */
const CONFETTI_COLORS = [
  "#1E3A5F", // royal blue
  "#2B4F7E", // primary-light
  "#00D4FF", // electric cyan
  "#33DFFF", // cyan-light
  "#FF6B2C", // vibrant orange
  "#FF8A57", // orange-light
  "#FFFFFF", // white
  "#F5C842", // gold accent
];

/* ─────────────────────────────────────────────
   Confetti particle shapes
───────────────────────────────────────────── */
const SHAPES = ["square", "rect", "circle", "roundRect", "module"];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createParticle(canvasW, canvasH) {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(3.5, 9);
  const size = randomBetween(5, 11);
  return {
    x: canvasW / 2 + randomBetween(-40, 40),
    y: canvasH * 0.38 + randomBetween(-30, 30),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - randomBetween(1, 4), // slight upward bias
    rotation: randomBetween(0, Math.PI * 2),
    rotationSpeed: randomBetween(-0.08, 0.08),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    w: size,
    h: shape => shape === "rect" ? size * 0.45 : size,
    opacity: 1,
    decay: randomBetween(0.012, 0.022),
    gravity: randomBetween(0.18, 0.32),
  };
}

function drawParticle(ctx, p) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, p.opacity);
  ctx.fillStyle = p.color;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);

  const h = p.shape === "rect" ? p.w * 0.45 : p.w;

  switch (p.shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "square":
      ctx.fillRect(-p.w / 2, -p.w / 2, p.w, p.w);
      break;
    case "rect":
      ctx.fillRect(-p.w / 2, -h / 2, p.w, h);
      break;
    case "roundRect":
      ctx.beginPath();
      const r = Math.min(p.w, h) * 0.3;
      ctx.roundRect(-p.w / 2, -h / 2, p.w, h, r);
      ctx.fill();
      break;
    case "module": {
      // tiny QR-like square with an inner void
      ctx.fillRect(-p.w / 2, -p.w / 2, p.w, p.w);
      ctx.globalAlpha = 0;
      const inner = p.w * 0.35;
      ctx.clearRect(-inner / 2, -inner / 2, inner, inner);
      break;
    }
    default:
      ctx.fillRect(-p.w / 2, -p.w / 2, p.w, p.w);
  }
  ctx.restore();
}

/* ─────────────────────────────────────────────
   SVG animated checkmark
───────────────────────────────────────────── */
function AnimatedCheck() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 20 }}
      style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1E3A5F 0%, #00D4FF 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 0 8px rgba(0,212,255,0.12), 0 8px 24px rgba(30,58,95,0.25)",
        marginBottom: "1.25rem",
        flexShrink: 0,
      }}
    >
      <motion.svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        initial="hidden"
        animate="visible"
      >
        <motion.path
          d="M8 18 L15 25 L28 12"
          stroke="white"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: {
              pathLength: 1,
              opacity: 1,
              transition: { delay: 0.75, duration: 0.55, ease: "easeOut" },
            },
          }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Subtle sparkle ring around the checkmark
───────────────────────────────────────────── */
function SparkleRing() {
  const sparks = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      {sparks.map((deg, i) => (
        <motion.div
          key={deg}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{ delay: 0.85 + i * 0.04, duration: 0.7, ease: "easeOut" }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: i % 2 === 0 ? "#00D4FF" : "#FF6B2C",
            transform: `rotate(${deg}deg) translate(48px, -3px)`,
            transformOrigin: "0 3px",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Animated QR: the freshly generated code springs
   in, is swept by a scan line, and glows.
───────────────────────────────────────────── */
function AnimatedQR({ svg }) {
  const fittedSvg = (svg || "").replace(
    /(width|height)="[^"]*"/g,
    (attr) => (attr.startsWith("width") ? 'width="100%"' : 'height="100%"')
  );

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.5rem", marginBottom: "1.25rem" }}>
      {/* Pulsing halo */}
      <motion.div
        animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: -16,
          borderRadius: 28,
          background: "radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,212,255,0) 70%)",
          filter: "blur(6px)",
          pointerEvents: "none",
        }}
      />

      {/* QR card entrance */}
      <motion.div
        initial={{ scale: 0.55, opacity: 0, rotate: -8, y: 20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
        transition={{ delay: 0.42, type: "spring", stiffness: 230, damping: 16 }}
        style={{
          position: "relative",
          background: "#FFFFFF",
          borderRadius: 16,
          padding: 12,
          boxShadow: "0 12px 40px rgba(30,58,95,0.22)",
          border: "1px solid rgba(0,212,255,0.35)",
          overflow: "hidden",
        }}
      >
        <div style={{ width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }} dangerouslySetInnerHTML={{ __html: fittedSvg }} />

        {/* Scan line sweeping over the QR */}
        <motion.div
          initial={{ top: "5%" }}
          animate={{ top: ["5%", "92%", "5%"] }}
          transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            height: 28,
            borderRadius: 20,
            background: "linear-gradient(180deg, transparent, rgba(0,212,255,0.4), transparent)",
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main celebration component
───────────────────────────────────────────── */
export default function FirstQRCelebration({ visible, onDismiss, onCreateAnother, qrSvg }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particlesRef = useRef([]);
  const router = useRouter();

  /* ── Confetti engine ── */
  const startConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Spawn ~85 particles in a quick staggered burst
    particlesRef.current = [];
    const spawn = (count) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle(canvas.width, canvas.height));
      }
    };

    spawn(55);
    setTimeout(() => spawn(30), 220);

    const ctx = canvas.getContext("2d");

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.opacity > 0);

      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;        // slight air resistance
        p.vy += p.gravity;    // gravity
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;
        drawParticle(ctx, p);
      }

      if (particlesRef.current.length > 0) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const cleanup = startConfetti();
    return () => {
      cleanup?.();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, startConfetti]);

  const handleCreateAnother = () => {
    onCreateAnother?.();
    onDismiss();
  };

  const handleDashboard = () => {
    onDismiss();
    router.push("/dashboard");
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onDismiss}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 490,
              background: "rgba(10, 22, 40, 0.5)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />

          {/* ── Confetti canvas ── */}
          <canvas
            ref={canvasRef}
            key="confetti"
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 495,
              pointerEvents: "none",
              width: "100%",
              height: "100%",
            }}
          />

          {/* ── Celebration card ── */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{
              delay: 0.35,
              type: "spring",
              stiffness: 280,
              damping: 22,
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "1.5rem",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.96)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderRadius: "24px",
                border: "1px solid rgba(0,212,255,0.2)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.8) inset, 0 4px 24px rgba(30,58,95,0.12), 0 0 48px rgba(0,212,255,0.12), 0 24px 64px rgba(10,22,40,0.18)",
                padding: "2.5rem 2.25rem 2rem",
                maxWidth: 420,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                pointerEvents: "auto",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle gradient shimmer at top of card */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: "linear-gradient(90deg, #1E3A5F 0%, #00D4FF 50%, #FF6B2C 100%)",
                  borderRadius: "24px 24px 0 0",
                }}
              />

              {/* Checkmark + sparkles, or the actual animated QR */}
              {qrSvg ? (
                <AnimatedQR svg={qrSvg} />
              ) : (
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.5rem" }}>
                  <AnimatedCheck />
                  <SparkleRing />
                </div>
              )}

              {/* Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  fontFamily: "'Outfit', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 4vw, 1.75rem)",
                  color: "#0A1628",
                  lineHeight: 1.15,
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Congratulations! 🎉
              </motion.h2>

              {/* Sub-headline */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.88, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: "1rem",
                  color: "#1E3A5F",
                  marginBottom: "0.375rem",
                  lineHeight: 1.45,
                }}
              >
                You created your first QR code of the day.
              </motion.p>

              {/* Motivational line */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.04, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 400,
                  fontSize: "0.875rem",
                  color: "#4A5568",
                  marginBottom: "1.75rem",
                }}
              >
                Another great QR starts here.
              </motion.p>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  width: "100%",
                  height: 1,
                  background: "linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)",
                  marginBottom: "1.5rem",
                  transformOrigin: "center",
                }}
              />

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.18, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem", width: "100%" }}
              >
                {/* Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(255,107,44,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCreateAnother}
                  style={{
                    width: "100%",
                    padding: "0.8125rem 1.75rem",
                    borderRadius: "9999px",
                    background: "linear-gradient(135deg, #FF6B2C 0%, #FF8A57 100%)",
                    color: "white",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    border: "none",
                    cursor: "pointer",
                    transition: "box-shadow 0.25s ease",
                    letterSpacing: "0.01em",
                  }}
                >
                  Create Another QR
                </motion.button>

                {/* Secondary ghost */}
                <motion.button
                  whileHover={{ color: "#1E3A5F", background: "rgba(30,58,95,0.05)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDashboard}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1.75rem",
                    borderRadius: "9999px",
                    background: "transparent",
                    color: "#4A5568",
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    border: "1.5px solid #D1D9E6",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  Continue to Dashboard
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
