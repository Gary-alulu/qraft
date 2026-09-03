"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MoreVertical, ExternalLink, QrCode, Edit, Copy, Archive, Trash2, Loader2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function RecentCodesTable({ codes, onUpdate, onDelete }) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const tableData = codes || [];

  const handleArchive = async (id) => {
    setLoadingId(id);
    setOpenDropdownId(null);
    try {
      const res = await fetch(`/api/qrcodes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      const result = await res.json();
      if (result.success && onUpdate) {
        onUpdate({ id, status: "archived" });
      }
    } catch (e) {
      console.error("Archive failed", e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this QR code? This cannot be undone.")) return;
    setLoadingId(id);
    setOpenDropdownId(null);
    try {
      const res = await fetch(`/api/qrcodes/${id}`, { method: "DELETE" });
      if (res.ok && onDelete) {
        onDelete(id);
      }
    } catch (e) {
      console.error("Delete failed", e);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDuplicate = async (code) => {
    setOpenDropdownId(null);
    try {
      const res = await fetch("/api/qrcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${code.name} (copy)`,
          type: code.type,
          contentData: code.contentData || {},
          isDynamic: false,
        }),
      });
      const result = await res.json();
      if (result.success && onUpdate) {
        // Signal parent to refetch or add the new code
        const newCode = {
          id: result.data._id,
          name: result.data.title,
          type: result.data.type,
          scans: 0,
          status: result.data.status,
          folderId: null,
        };
        onUpdate(newCode); // parent can choose to append
      }
    } catch (e) {
      console.error("Duplicate failed", e);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
        overflow: "visible", // Changed from hidden to allow dropdowns to show
      }}
    >
      <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)" }}>Recent QR Codes</h3>
        <Link href="/dashboard/codes" style={{ color: "var(--color-primary)", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none" }}>View All</Link>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.02)" }}>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}>Name</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}>Type</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}>Scans</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((code) => (
              <tr key={code.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 500 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "32px", height: "32px", background: "var(--color-bg)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <QrCode size={16} color="var(--color-primary)" />
                    </div>
                    {code.name}
                  </div>
                </td>
                <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>{code.type}</td>
                <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{code.scans.toLocaleString()}</td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <Badge variant={code.status === "active" ? "success" : "warning"}>{code.status}</Badge>
                </td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)" }}>
                    {loadingId === code.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        {code.status === "active" && (
                          <a href={`/r/${code.id}`} target="_blank" rel="noreferrer" style={{ color: "inherit" }} title="Test Link">
                            <ExternalLink size={18} />
                          </a>
                        )}

                        <div style={{ position: "relative" }}>
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === code.id ? null : code.id)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: "0.25rem" }}
                            title="More Options"
                          >
                            <MoreVertical size={18} />
                          </button>

                          <AnimatePresence>
                            {openDropdownId === code.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                  position: "absolute", right: 0, top: "100%", marginTop: "0.25rem",
                                  background: "var(--color-surface)", border: "1px solid var(--color-border-light)",
                                  borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)",
                                  padding: "0.25rem", zIndex: 50, minWidth: "150px", display: "flex", flexDirection: "column"
                                }}
                              >
                                <Link href={`/studio?edit=${code.id}`} style={{ textDecoration: "none" }}>
                                  <button style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", fontSize: "0.875rem", color: "var(--color-text)", background: "transparent", border: "none", borderRadius: "4px", cursor: "pointer", textAlign: "left" }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--color-bg)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                    <Edit size={14} /> Edit
                                  </button>
                                </Link>
                                <button onClick={() => handleDuplicate(code)}
                                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", fontSize: "0.875rem", color: "var(--color-text)", background: "transparent", border: "none", borderRadius: "4px", cursor: "pointer", textAlign: "left" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "var(--color-bg)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                  <Copy size={14} /> Duplicate
                                </button>
                                <button onClick={() => handleArchive(code.id)}
                                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", fontSize: "0.875rem", color: "var(--color-text)", background: "transparent", border: "none", borderRadius: "4px", cursor: "pointer", textAlign: "left" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "var(--color-bg)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                  <Archive size={14} /> Archive
                                </button>
                                <div style={{ height: "1px", background: "var(--color-border-light)", margin: "0.25rem 0" }} />
                                <button onClick={() => handleDelete(code.id)}
                                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", fontSize: "0.875rem", color: "var(--color-error)", background: "transparent", border: "none", borderRadius: "4px", cursor: "pointer", textAlign: "left" }}
                                  onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.05)"}
                                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                  <Trash2 size={14} /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

