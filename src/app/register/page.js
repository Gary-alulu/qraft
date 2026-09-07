"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getSupabaseBrowser, isSupabaseAuthConfigured } from "@/lib/supabase-browser";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Registration failed");
        setLoading(false);
        return;
      }

      if (data?.session) {
        // Session created immediately -> straight to dashboard.
        window.location.href = "/dashboard";
        return;
      }

      // Email confirmation required.
      setMessage("Check your email to confirm your account before signing in.");
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
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", marginBottom: "1rem" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "1.125rem" }}>Q</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>Create an account</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Start generating beautiful QR codes</p>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input 
            label="Name" 
            placeholder="Gary" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
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
          <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: "0.25rem" }}>
            Sign Up
          </Button>
        </form>

        <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          Already have an account? <a href="/login" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
        </div>
      </motion.div>
    </div>
  );
}
