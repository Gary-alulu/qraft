"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getSupabaseBrowser, isSupabaseAuthConfigured } from "@/lib/supabase-browser";
import { Loader2 } from "lucide-react";

function UpdatePasswordContent() {
  const searchParams = useSearchParams();
  const [state, setState] = useState("processing"); // processing | ready | error | done
  const [statusMessage, setStatusMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseAuthConfigured()) {
      setState("error");
      setStatusMessage("Authentication is not configured. Please contact support.");
      return;
    }

    const supabase = getSupabaseBrowser();
    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    (async () => {
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (tokenHash) {
          const { error } = await supabase.auth.verifyOtp({
            type: type || "recovery",
            token_hash: tokenHash,
          });
          if (error) throw error;
        } else {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            throw new Error("Invalid or expired password reset link.");
          }
        }
        setState("ready");
      } catch (err) {
        setState("error");
        setStatusMessage(
          err.message || "This reset link is invalid or has expired. Please request a new one."
        );
      }
    })();
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");

    if (password.length < 6) {
      setStatusMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setStatusMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setState("done");
    } catch (err) {
      setStatusMessage(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (state === "processing") {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-bg)", padding: "1.5rem", maxHeight: "100vh", overflowY: "auto", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: "100%", maxWidth: "400px", background: "var(--color-surface)", borderRadius: "var(--radius-2xl)", padding: "1.75rem", boxShadow: "var(--shadow-xl)", border: "1px solid var(--color-border-light)", margin: "auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <Image src="/images/favicon.png" alt="QRAFT" width={4725} height={4726} style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", marginBottom: "1rem", display: "inline-block" }} />
          {state === "ready" && (
            <>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>Choose a new password</h1>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Pick a strong password for your Qraft account</p>
            </>
          )}
          {state === "done" && (
            <>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-text)" }}>Password updated</h1>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                Your password has been changed successfully.
              </p>
              <a href="/login" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none", fontSize: "0.9375rem" }}>
                Go to sign in →
              </a>
            </>
          )}
          {state === "error" && (
            <>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, color: "var(--color-error)" }}>Reset link invalid</h1>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{statusMessage}</p>
              <a href="/forgot-password" style={{ display: "inline-block", marginTop: "1.5rem", color: "var(--color-primary)", fontWeight: 600, textDecoration: "none", fontSize: "0.9375rem" }}>
                Request a new reset link →
              </a>
            </>
          )}
        </div>

        {state === "ready" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              label="New password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="Re-enter your new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {statusMessage && (
              <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--color-error)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", border: "1px solid rgba(239, 68, 68, 0.2)", overflowWrap: "break-word" }}>
                {statusMessage}
              </div>
            )}
            <Button type="submit" variant="primary" loading={loading} style={{ width: "100%", marginTop: "0.25rem" }}>
              Update Password
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={null}>
      <UpdatePasswordContent />
    </Suspense>
  );
}