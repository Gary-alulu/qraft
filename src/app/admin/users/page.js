"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Loader2, Trash2, Shield } from "lucide-react";

const ROLE_STYLES = {
  admin: { background: "rgba(139, 92, 246, 0.12)", color: "var(--color-secondary)" },
  user: { background: "var(--color-border-light)", color: "var(--color-text-muted)" },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load users");
      setUsers(data.data);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateUser = async (id, field, value) => {
    setUpdatingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, [field]: data.data[field] } : u)));
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (id, email) => {
    if (!window.confirm(`Delete ${email} permanently? This removes all their codes and data.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (error && !users) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-error)", marginBottom: "0.5rem" }}>Failed to load users</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>{error}</p>
      </div>
    );
  }

  if (!users) {
    return (
      <div style={{ height: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text)" }}>Users</h1>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>{users.length} account{users.length === 1 ? "" : "s"} (most recent first).</p>
      </div>

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "var(--color-error)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginBottom: "1rem" }}>{error}</div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-text-secondary)", borderBottom: "1px solid var(--color-border-light)", background: "rgba(0,0,0,0.015)" }}>
              <th style={{ padding: "0.75rem 1rem" }}>User</th>
              <th style={{ padding: "0.75rem 1rem" }}>Role</th>
              <th style={{ padding: "0.75rem 1rem" }}>Plan</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Codes</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Scans</th>
              <th style={{ padding: "0.75rem 1rem" }}>Joined</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "0.875rem", flexShrink: 0 }}>
                      {(u.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: "var(--color-text)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        {u.name}
                        {u.role === "admin" && <Shield size={13} color="var(--color-secondary)" />}
                      </div>
                      <div style={{ color: "var(--color-text-secondary)", fontSize: "0.8125rem" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <select
                    value={u.role}
                    disabled={updatingId === u.id}
                    onChange={(e) => updateUser(u.id, "role", e.target.value)}
                    style={{
                      padding: "0.35rem 0.6rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      ...ROLE_STYLES[u.role],
                    }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <select
                    value={u.plan}
                    disabled={updatingId === u.id}
                    onChange={(e) => updateUser(u.id, "plan", e.target.value)}
                    style={{
                      padding: "0.35rem 0.6rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text)",
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                    }}
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="business">Business</option>
                  </select>
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "var(--color-text)", fontWeight: 600 }}>{u.codes}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "var(--color-text)", fontWeight: 600 }}>{u.scans.toLocaleString()}</td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-secondary)", fontSize: "0.8125rem" }}>{u.joined}</td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                  <button
                    onClick={() => deleteUser(u.id, u.email)}
                    disabled={deletingId === u.id}
                    title="Delete user"
                    style={{ width: 34, height: 34, borderRadius: "10px", border: "1px solid rgba(239,68,68,0.25)", background: "transparent", color: "var(--color-error)", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {deletingId === u.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}