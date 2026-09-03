"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import { Check, Loader2, ArrowRight } from "lucide-react";

const inputStyle = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg)",
  outline: "none",
  fontSize: "0.9375rem",
  fontFamily: "var(--font-body)",
  transition: "border-color 0.2s",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "var(--color-text)",
};

export default function SettingsClient({ user }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // "success" | "error" | null

  const [profile, setProfile] = useState({
    name: user?.name || "",
    company: user?.company || "",
    jobTitle: user?.jobTitle || "",
    timezone: user?.timezone || "UTC",
    language: user?.language || "en",
  });

  const [notifications, setNotifications] = useState({
    emailScans: user?.notifications?.emailScans ?? true,
    emailWeeklyReport: user?.notifications?.emailWeeklyReport ?? true,
    emailProduct: user?.notifications?.emailProduct ?? false,
  });

  const showStatus = (status) => {
    setSaveStatus(status);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error("Failed");
      showStatus("success");
    } catch {
      showStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifications }),
      });
      if (!res.ok) throw new Error("Failed");
      showStatus("success");
    } catch {
      showStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const SaveFeedback = () => (
    <div style={{ height: "24px" }}>
      {saveStatus === "success" && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "var(--color-success)", fontSize: "0.875rem", fontWeight: 500 }}>
          <Check size={14} /> Saved successfully
        </motion.span>
      )}
      {saveStatus === "error" && (
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ color: "var(--color-error)", fontSize: "0.875rem" }}>
          Something went wrong. Please try again.
        </motion.span>
      )}
    </div>
  );

  const ToggleRow = ({ label, description, field }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1rem 0", borderBottom: "1px solid var(--color-border-light)" }}>
      <div>
        <p style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{label}</p>
        <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>{description}</p>
      </div>
      <button
        onClick={() => setNotifications(prev => ({ ...prev, [field]: !prev[field] }))}
        style={{
          width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
          background: notifications[field] ? "var(--color-primary)" : "var(--color-border)",
          position: "relative", transition: "background 0.2s", flexShrink: 0, marginLeft: "1rem"
        }}
      >
        <span style={{
          position: "absolute", top: "2px",
          left: notifications[field] ? "22px" : "2px",
          width: "20px", height: "20px", borderRadius: "50%",
          background: "white", transition: "left 0.2s",
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", overflow: "hidden" }}>
      <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border-light)" }}>
        <Tabs
          tabs={[
            { id: "profile", label: "Profile" },
            { id: "billing", label: "Billing" },
            { id: "notifications", label: "Notifications" },
            { id: "security", label: "Security" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div style={{ padding: "2rem" }}>
        {/* ── Profile ── */}
        {activeTab === "profile" && (
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "480px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input type="email" value={user?.email || ""} disabled style={{ ...inputStyle, background: "rgba(0,0,0,0.02)", color: "var(--color-text-muted)", cursor: "not-allowed" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Company</label>
                <input type="text" value={profile.company} onChange={e => setProfile({ ...profile, company: e.target.value })} placeholder="Acme Inc." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Job Title</label>
                <input type="text" value={profile.jobTitle} onChange={e => setProfile({ ...profile, jobTitle: e.target.value })} placeholder="Head of Marketing" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Timezone</label>
                <select value={profile.timezone} onChange={e => setProfile({ ...profile, timezone: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                  {["UTC", "Africa/Nairobi", "Europe/London", "America/New_York", "America/Los_Angeles", "Asia/Tokyo"].map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Language</label>
                <select value={profile.language} onChange={e => setProfile({ ...profile, language: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--color-border-light)", display: "flex", alignItems: "center", gap: "1rem" }}>
              <Button type="submit" variant="primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Save Changes
              </Button>
              <SaveFeedback />
            </div>
          </form>
        )}

        {/* ── Billing ── */}
        {activeTab === "billing" && (
          <div style={{ maxWidth: "480px" }}>
            <div style={{ padding: "1.5rem", background: "linear-gradient(135deg, rgba(30, 58, 95, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-light)", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-text)", textTransform: "capitalize" }}>{user?.plan || "Free"} Plan</h3>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-success)", background: "rgba(16, 185, 129, 0.1)", padding: "0.25rem 0.625rem", borderRadius: "var(--radius-pill)" }}>Active</span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
                {user?.plan === "free"
                  ? "You're on the Free plan. Upgrade to unlock dynamic QR codes, advanced analytics, and brand kits."
                  : "Thank you for being a Qraft Pro member."}
              </p>
              {user?.plan === "free" && (
                <Button variant="accent" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  Upgrade to Pro <ArrowRight size={16} />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ── Notifications ── */}
        {activeTab === "notifications" && (
          <div style={{ maxWidth: "480px" }}>
            <ToggleRow label="Scan Alerts" description="Get notified when a QR code reaches a scan milestone." field="emailScans" />
            <ToggleRow label="Weekly Report" description="Receive a weekly summary of your QR code performance." field="emailWeeklyReport" />
            <ToggleRow label="Product Updates" description="New features, improvements, and Qraft announcements." field="emailProduct" />

            <div style={{ paddingTop: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <Button variant="primary" onClick={handleSaveNotifications} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                Save Preferences
              </Button>
              <SaveFeedback />
            </div>
          </div>
        )}

        {/* ── Security ── */}
        {activeTab === "security" && (
          <div style={{ maxWidth: "480px" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Change Password</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                We will email you a secure link to reset your password.
              </p>
              <Button variant="secondary">Request Password Reset</Button>
            </div>

            <div style={{ paddingTop: "2rem", borderTop: "1px solid var(--color-border-light)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-error)", marginBottom: "0.5rem" }}>Danger Zone</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                Once you delete your account, there is no going back. All your QR codes and data will be permanently removed.
              </p>
              <button style={{ padding: "0.625rem 1.25rem", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", background: "rgba(239,68,68,0.05)", color: "var(--color-error)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
