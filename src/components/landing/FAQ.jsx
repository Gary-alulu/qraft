"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Accordion from "@/components/ui/Accordion";

const faqs = [
  {
    title: "What is a dynamic QR code?",
    content: "A dynamic QR code allows you to change the destination URL or content even after it has been printed. It routes through our servers, which also allows us to collect scan analytics like location and device type.",
  },
  {
    title: "Can I use the QR codes for commercial purposes?",
    content: "Yes, all QR codes generated on Qraft, even on the free tier, can be used for commercial purposes without any restrictions.",
  },
  {
    title: "Will my QR codes expire?",
    content: "Static QR codes never expire. Dynamic QR codes require an active Qraft subscription to remain routable, unless you're on a lifetime plan.",
  },
  {
    title: "How do I ensure my QR code is scannable?",
    content: "Our Design Studio includes a real-time Scanability Score that analyzes contrast, quiet zones, and logo sizing to ensure your QR code will scan reliably before you print it.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="section-padding" style={{ background: "var(--color-surface)" }}>
      <div className="container-qraft" style={{ maxWidth: "800px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
              fontWeight: 700,
              color: "var(--color-text)",
            }}
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion items={faqs} />
        </motion.div>
        
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "1rem" }}>Still have questions?</p>
          <Button variant="secondary" href="/contact">Contact Support</Button>
        </div>
      </div>
    </section>
  );
}
