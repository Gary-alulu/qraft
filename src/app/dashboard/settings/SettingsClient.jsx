"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import UserAvatar from "@/components/ui/UserAvatar";
import Tabs from "@/components/ui/Tabs";
import { Check, Loader2, ArrowRight, AlertTriangle, ExternalLink } from "lucide-react";
import { getSupabaseBrowser, isSupabaseAuthConfigured } from "@/lib/supabase-browser";
import { useSession } from "@/components/providers/AuthProvider";

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

export default function SettingsClient({ user, gravatarSrc = "" }) {
  const { signOut } = useSession();
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

  const [smartPrefs, setSmartPrefs] = useState({
    inApp: true,
    email: true,
    push: false,
    qrMilestones: true,
    trafficSpikes: true,
    trafficDrops: true,
    conversionMilestones: true,
    expiration7d: true,
    expiration3d: true,
    expiration24h: true,
    expirationWhenExpired: true,
    suspiciousTraffic: true,
    destinationIssues: true,
    securityWarnings: true,
    campaignMilestones: true,
    campaignPerformance: true,
    abTestResults: true,
    scanabilityAlerts: true,
    usageAlerts: true,
  });

  // Load smart preferences on mount
  useState(() => {
    fetch("/api/notifications/preferences")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.preferences) {
          setSmartPrefs((prev) => ({ ...prev, ...data.preferences }));
        }
      })
      .catch(() => {});
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
      const [res1, res2] = await Promise.all([
        fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notifications }),
        }),
        fetch("/api/notifications/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(smartPrefs),
        }),
      ]);
      if (!res1.ok && !res2.ok) throw new Error("Failed");
      showStatus("success");
    } catch {
      showStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const [pwFields, setPwFields] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwStatus, setPwStatus] = useState(null); // { type: "success"|"error", msg }

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwStatus(null);

    if (pwFields.next.length < 6) {
      setPwStatus({ type: "error", msg: "New password must be at least 6 characters." });
      return;
    }
    if (pwFields.next !== pwFields.confirm) {
      setPwStatus({ type: "error", msg: "New passwords do not match." });
      return;
    }
    if (!user?.email) {
      setPwStatus({ type: "error", msg: "Unable to verify your current password. Please sign out and sign in again." });
      return;
    }
    if (!isSupabaseAuthConfigured()) {
      setPwStatus({ type: "error", msg: "Authentication is not configured yet." });
      return;
    }

    setPwSaving(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: pwFields.current,
      });
      if (reauthError) {
        setPwStatus({ type: "error", msg: "Current password is incorrect." });
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: pwFields.next });
      if (error) throw error;

      setPwStatus({ type: "success", msg: "Password updated successfully." });
      setPwFields({ current: "", next: "", confirm: "" });
    } catch (err) {
      setPwStatus({ type: "error", msg: err.message || "Failed to update password. Please try again." });
    } finally {
      setPwSaving(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to delete account");
      }
      await signOut();
      window.location.href = "/";
    } catch (err) {
      setDeleteError(err.message || "Failed to delete account. Please try again.");
      setDeleting(false);
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

  const SmartToggleRow = ({ label, description, field }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", borderBottom: "1px solid var(--color-border-light)" }}>
      <div style={{ paddingRight: "1rem" }}>
        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text)" }}>{label}</p>
        {description && <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => setSmartPrefs(prev => ({ ...prev, [field]: !prev[field] }))}
        style={{
          width: "40px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
          background: smartPrefs[field] ? "var(--color-primary)" : "var(--color-border)",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: "2px",
          left: smartPrefs[field] ? "20px" : "2px",
          width: "18px", height: "18px", borderRadius: "50%",
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

            {/* Avatar preview */}
            <div style={{
              display: "flex", alignItems: "center", gap: "1.25rem",
              padding: "1.25rem", borderRadius: "var(--radius-lg)",
              background: "linear-gradient(135deg, rgba(30,58,95,0.04) 0%, rgba(0,212,255,0.04) 100%)",
              border: "1px solid var(--color-border-light)",
              marginBottom: "0.25rem",
            }}>
              <UserAvatar name={user?.name || ""} gravatarSrc={gravatarSrc} size={64} style={{ border: "2.5px solid var(--color-border-light)", boxShadow: "0 4px 12px rgba(30,58,95,0.12)" }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-text)", marginBottom: "0.25rem" }}>
                  {gravatarSrc ? "Profile photo from Gravatar" : "No profile photo found"}
                </p>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                  {gravatarSrc
                    ? "Your photo is pulled automatically from your Gravatar account."
                    : "Add a photo by creating a free Gravatar linked to your email address."}
                </p>
                <a
                  href={`https://gravatar.com/emails/?email=${encodeURIComponent(user?.email || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: "var(--color-primary)", fontWeight: 500, marginTop: "0.5rem", textDecoration: "none" }}
                >
                  {gravatarSrc ? "Change on Gravatar" : "Set up Gravatar"} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="q-pair" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" value={user?.email || ""} disabled style={{ ...inputStyle, background: "rgba(0,0,0,0.02)", color: "var(--color-text-muted)", cursor: "not-allowed" }} />
                </div>
              </div>

              <div className="q-pair" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input type="text" value={profile.company} onChange={e => setProfile({ ...profile, company: e.target.value })} placeholder="Acme Inc." style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Job Title</label>
                  <input type="text" value={profile.jobTitle} onChange={e => setProfile({ ...profile, jobTitle: e.target.value })} placeholder="Head of Marketing" style={inputStyle} />
                </div>
              </div>

              <div className="q-pair" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
          <div style={{ maxWidth: "560px" }}>
            {/* General Channels */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                Delivery Channels
              </h3>
              <SmartToggleRow label="In-app Notifications" description="Show live alerts in the dashboard bell and notification center." field="inApp" />
              <SmartToggleRow label="Email Notifications" description="Receive alert digests and urgent notifications at your email address." field="email" />
              <SmartToggleRow label="Browser Push" description="Receive desktop alerts when critical spikes or broken links are detected." field="push" />
            </div>

            {/* QR Performance */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                QR Performance & Milestones
              </h3>
              <SmartToggleRow label="Scan Milestones" description="Alert when a QR code crosses 100, 500, 1K, 5K, 10K, 25K, 50K, 100K scans." field="qrMilestones" />
              <SmartToggleRow label="Traffic Spikes" description="Alert when hourly scan velocity surges 3× or more above normal traffic." field="trafficSpikes" />
              <SmartToggleRow label="Traffic Drops" description="Alert when a QR code experiences a >50% drop compared to expected scans." field="trafficDrops" />
              <SmartToggleRow label="Conversion Milestones" description="Notify when a campaign conversion rate crosses a new tier." field="conversionMilestones" />
            </div>

            {/* Expiration */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                Expiration Alerts
              </h3>
              <SmartToggleRow label="7 Days Before" description="Early warning when a scheduled QR is expiring next week." field="expiration7d" />
              <SmartToggleRow label="3 Days Before" description="Upcoming warning 3 days before a QR code ceases redirection." field="expiration3d" />
              <SmartToggleRow label="24 Hours Before" description="Urgent notice 24 hours prior to expiration." field="expiration24h" />
              <SmartToggleRow label="When Expired" description="Critical notice when a QR code has stopped redirecting." field="expirationWhenExpired" />
            </div>

            {/* Security */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                Security & Reliability
              </h3>
              <SmartToggleRow label="Suspicious Traffic" description="Alert on anomalous foreign geographic scan bursts or scraping patterns." field="suspiciousTraffic" />
              <SmartToggleRow label="Broken Destination URLs" description="Proactively notify when a target URL returns a 404 or 500 status code." field="destinationIssues" />
              <SmartToggleRow label="Security Warnings" description="Alert when rate limiting or destination security rules block traffic." field="securityWarnings" />
            </div>

            {/* Campaigns */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                Campaigns & Experiments
              </h3>
              <SmartToggleRow label="Campaign Milestones" description="Alert when a campaign hits major collective scan targets." field="campaignMilestones" />
              <SmartToggleRow label="Performance Shifts" description="Notify when weekly campaign engagement shifts by >25%." field="campaignPerformance" />
              <SmartToggleRow label="A/B Test Results" description="Proactively detect and notify when a variant statistically outperforms another." field="abTestResults" />
            </div>

            {/* System & Quota */}
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--color-text)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.5rem" }}>
                Health & Plan Limits
              </h3>
              <SmartToggleRow label="Scanability Score Decreases" description="Alert when design customization lowers scanability score below 80." field="scanabilityAlerts" />
              <SmartToggleRow label="Usage Quota Warnings" description="Warn when approaching 80%+ of free or tier monthly scan capacity." field="usageAlerts" />
            </div>

            <div style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--color-border-light)", display: "flex", alignItems: "center", gap: "1rem" }}>
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
            <form onSubmit={handleChangePassword} style={{ marginBottom: "2rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Change Password</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                Enter your current password, then choose a new one.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input type="password" value={pwFields.current} onChange={e => setPwFields({ ...pwFields, current: e.target.value })} autoComplete="current-password" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input type="password" value={pwFields.next} onChange={e => setPwFields({ ...pwFields, next: e.target.value })} autoComplete="new-password" placeholder="At least 6 characters" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input type="password" value={pwFields.confirm} onChange={e => setPwFields({ ...pwFields, confirm: e.target.value })} autoComplete="new-password" placeholder="Re-enter your new password" style={inputStyle} />
                </div>

                {pwStatus && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{
                      padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem",
                      background: pwStatus.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      color: pwStatus.type === "success" ? "var(--color-success)" : "var(--color-error)",
                      border: `1px solid ${pwStatus.type === "success" ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.2)"}`,
                    }}>
                    {pwStatus.type === "success" && <Check size={14} style={{ verticalAlign: "middle", marginRight: "0.375rem" }} />}
                    {pwStatus.msg}
                  </motion.div>
                )}

                <div>
                  <Button type="submit" variant="primary" loading={pwSaving} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                    {!pwSaving && <Check size={16} />}
                    Update Password
                  </Button>
                </div>
              </div>
            </form>

            <div style={{ paddingTop: "1.75rem", borderTop: "1px solid var(--color-border-light)" }}>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.5rem" }}>Forgot your password?</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                Can&apos;t remember your password? We&apos;ll email you a secure link to reset it.
              </p>
              <a href="/forgot-password" style={{ textDecoration: "none" }}>
                <Button variant="secondary">Request Password Reset</Button>
              </a>
            </div>

            <div style={{ paddingTop: "2rem", borderTop: "1px solid var(--color-border-light)" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-error)", marginBottom: "0.5rem" }}>Danger Zone</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
                Once you delete your account, there is no going back. All your QR codes and data will be permanently removed.
              </p>

              {deleteError && (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--color-error)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: "1rem" }}>
                  {deleteError}
                </div>
              )}

              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{ padding: "0.625rem 1.25rem", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", background: "rgba(239,68,68,0.05)", color: "var(--color-error)", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}
                >
                  Delete Account
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-lg)", padding: "1.25rem", background: "rgba(239,68,68,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <AlertTriangle size={18} color="var(--color-error)" />
                    <strong style={{ fontSize: "0.9375rem", color: "var(--color-error)" }}>Are you absolutely sure?</strong>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1.25rem" }}>
                    This permanently deletes your account, all QR codes, analytics, and saved data. This action cannot be undone.
                  </p>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1.25rem", border: "1px solid rgba(239,68,68,0.4)", borderRadius: "var(--radius-md)", background: "rgba(239,68,68,0.12)", color: "var(--color-error)", cursor: deleting ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.875rem", opacity: deleting ? 0.6 : 1 }}
                    >
                      {deleting ? <Loader2 size={16} className="animate-spin" /> : <AlertTriangle size={16} />}
                      {deleting ? "Deleting..." : "Delete My Account"}
                    </button>
                    <Button variant="secondary" onClick={() => { setShowDeleteConfirm(false); setDeleteError(""); }} disabled={deleting}>
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
