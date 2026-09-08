"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getSupabaseBrowser, isSupabaseAuthConfigured } from "@/lib/supabase-browser";
import { getSafeNext } from "@/lib/auth-redirect";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const next = getSafeNext(searchParams.get("next"));
  const nextQuery = next ? `?next=${encodeURIComponent(next)}` : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!isSupabaseAuthConfigured()) {
      setError("Authentication is not configured yet. Please contact support.");
      setLoading(false);
      return;
    }

    try {
      const supabase = getSupabaseBrowser();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      window.location.href = next;
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
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", marginBottom: "1rem" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "1.125rem" }}>Q</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>Welcome back</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Sign in to your Qraft account</p>
        </div>

        {error && (
          <div style={{ 
            background: "rgba(239, 68, 68, 0.1)", 
            color: "var(--color-error)", 
            padding: "0.75rem 1rem", 
            borderRadius: "var(--radius-md)", 
            fontSize: "0.875rem", 
            marginBottom: "1.25rem",
            border: "1px solid rgba(239, 68, 68, 0.2)"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="gary@example.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <div style={{ textAlign: "right", marginTop: "-0.75rem" }}>
            <a href="/forgot-password" style={{ fontSize: "0.8125rem", color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>Forgot password?</a>
          </div>
          <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: "0.25rem" }}>
            Sign In
          </Button>
        </form>

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
