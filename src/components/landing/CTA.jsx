"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="section-padding" style={{ padding: "6rem 1.5rem" }}>
      <div className="container-qraft">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="gradient-cta"
          style={{
            borderRadius: "var(--radius-2xl)",
            padding: "4rem 2rem",
            textAlign: "center",
            color: "white",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(0,212,255,0.2) 0%, rgba(0,0,0,0) 70%)" }} />
          <div style={{ position: "absolute", bottom: "-50%", right: "-10%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(255,107,44,0.2) 0%, rgba(0,0,0,0) 70%)" }} />
          
          <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
              }}
            >
              Ready to create your first QR code?
            </h2>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.8)", marginBottom: "2.5rem" }}>
              Join thousands of businesses using Qraft to create beautiful, trackable QR experiences.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Button href="/studio" style={{ background: "white", color: "var(--color-primary)" }} size="lg">
                Go to Studio
              </Button>
              <Button href="#pricing" variant="ghost" size="lg" style={{ color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>
                View Pricing
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
