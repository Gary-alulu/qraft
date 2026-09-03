"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Register the user via our API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // 2. Auto-login after successful registration
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but auto-login failed; redirect to login
        window.location.href = "/login";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", padding: "1.5rem" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "420px", background: "var(--color-surface)", borderRadius: "var(--radius-2xl)", padding: "2.5rem", boxShadow: "var(--shadow-xl)", border: "1px solid var(--color-border-light)" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", marginBottom: "1.5rem" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: "1.25rem" }}>Q</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 700, color: "var(--color-text)" }}>Create an account</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9375rem", marginTop: "0.5rem" }}>Start generating beautiful QR codes</p>
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

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
          <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: "0.5rem" }}>
            Sign Up
          </Button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          Already have an account? <a href="/login" style={{ color: "var(--color-primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</a>
        </div>
      </motion.div>
    </div>
  );
}
