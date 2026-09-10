"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getSupabaseBrowser, isSupabaseAuthConfigured } from "@/lib/supabase-browser";
import { getSafeNext } from "@/lib/auth-redirect";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const searchParams = useSearchParams();
  const next = getSafeNext(searchParams.get("next"));
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

    if (!isSupabaseAuthConfigured()) {
      setError("Authentication is not configured yet. Please contact support.");
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowser();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (otpError) {
        setError(otpError.message || "Could not send a sign-in link.");
        setLoading(false);
        return;
      }

      setSent(true);
      setLoading(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const displayEmail = email.trim().toLowerCase();

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", padding: "1.5rem", maxHeight: "100vh", overflowY: "auto", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "400px", background: "var(--color-surface)", borderRadius: "var(--radius-2xl)", padding: "1.75rem", boxShadow: "var(--shadow-xl)", border: "1px solid var(--color-border-light)", margin: "auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Image src="/images/favicon.png" alt="QRAFT" width={4725} height={4726} style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", marginBottom: "1rem", display: "inline-block" }} />
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>
            {sent ? "Check your email" : "Welcome back"}
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {sent
              ? `We sent a sign-in link to ${displayEmail}`
              : "We'll email you a secure sign-in link — no password needed"}
          </p>
        </div>

        {sent ? (
          <>
            <div style={{
              background: "rgba(0, 212, 255, 0.08)",
              color: "var(--color-secondary-dark)",
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.875rem",
              border: "1px solid rgba(0, 212, 255, 0.25)",
              overflowWrap: "break-word",
            }}>
              Click the link in the email to sign in securely. The link expires in a few minutes.
            </div>
            <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
              Didn&apos;t get it?{" "}
              <button
                type="button"
                onClick={() => { setSent(false); setEmail(""); }}
                style={{ background: "none", border: "none", padding: 0, color: "var(--color-primary)", fontWeight: 600, cursor: "pointer", font: "inherit" }}
              >
                Try a different email
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                color: "var(--color-error)",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                overflowWrap: "break-word",
              }}>
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="gary@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div style={{ textAlign: "right", marginTop: "-0.75rem" }}>
              <a href="/forgot-password" style={{ fontSize: "0.8125rem", color: "var(--color-primary)", fontWeight: 500, textDecoration: "none", display: "inline-block", padding: "0.5rem 0 0.5rem 0.75rem", marginRight: "-0.75rem" }}>Forgot password?</a>
            </div>
            <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: "0.25rem" }}>
              Email me a sign-in link
            </Button>
          </form>
        )}

        <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Don&apos;t have an account? <a href={`/register${nextQuery}`} style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Sign up</a>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}