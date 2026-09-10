"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getSupabaseBrowser, isSupabaseAuthConfigured } from "@/lib/supabase-browser";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!isSupabaseAuthConfigured()) {
      setError("Authentication is not configured yet. Please contact support.");
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowser();
      const redirectTo = `${window.location.origin}/auth/update-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (resetError) {
        setError(resetError.message || "Failed to send reset link");
        setLoading(false);
        return;
      }

      setMessage("If an account exists for that email, we've sent you a secure link to reset your password.");
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", padding: "1.5rem", maxHeight: "100vh", overflowY: "auto", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "400px", background: "var(--color-surface)", borderRadius: "var(--radius-2xl)", padding: "1.75rem", boxShadow: "var(--shadow-xl)", border: "1px solid var(--color-border-light)", margin: "auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Image src="/images/favicon.png" alt="QRAFT" width={4725} height={4726} style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", marginBottom: "1rem", display: "inline-block" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>Reset your password</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Enter your email and we&apos;ll send you a secure reset link</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            color: "var(--color-error)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
            marginBottom: "1.25rem",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            overflowWrap: "break-word"
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            background: "rgba(0, 212, 255, 0.08)",
            color: "var(--color-secondary-dark)",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
            marginBottom: "1.25rem",
            border: "1px solid rgba(0, 212, 255, 0.25)"
          }}>
            {message}
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              label="Email"
              type="email"
              placeholder="gary@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: "0.25rem" }}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Remembered it? <a href="/login" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Back to sign in</a>
        </div>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}