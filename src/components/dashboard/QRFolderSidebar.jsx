"use client";

import { useState } from "react";
import { Folder, Plus, MoreHorizontal } from "lucide-react";

export default function QRFolderSidebar({ folders, activeFolder, setActiveFolder }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreate = async () => {
    if (!newFolderName.trim()) return;
    
    // In a real app, you'd call a server action or API route here,
    // then refresh the router to update the folders list.
    await fetch("/api/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newFolderName }),
    });
    
    setIsCreating(false);
    setNewFolderName("");
    // Hard refresh for now to load new folder
    window.location.reload();
  };

  return (
    <div style={{ width: "240px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ padding: "0 0.5rem", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Library</h3>
        <button onClick={() => setIsCreating(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)" }}>
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={() => setActiveFolder(null)}
        style={{
          display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0.75rem",
          borderRadius: "var(--radius-md)", width: "100%", textAlign: "left", cursor: "pointer",
          background: activeFolder === null ? "var(--color-primary-light)" : "transparent",
          color: activeFolder === null ? "white" : "var(--color-text-secondary)",
          fontWeight: activeFolder === null ? 600 : 500,
          border: "none",
          fontSize: "0.875rem"
        }}
      >
        <Folder size={18} />
        All Codes
      </button>

      {folders.map(folder => (
        <button
          key={folder._id}
          onClick={() => setActiveFolder(folder._id)}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem",
            borderRadius: "var(--radius-md)", width: "100%", textAlign: "left", cursor: "pointer",
            background: activeFolder === folder._id ? "var(--color-primary-light)" : "transparent",
            color: activeFolder === folder._id ? "white" : "var(--color-text-secondary)",
            fontWeight: activeFolder === folder._id ? 600 : 500,
            border: "none",
            fontSize: "0.875rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
             <Folder size={18} color={activeFolder === folder._id ? "white" : folder.color} />
             {folder.name}
          </div>
          {activeFolder === folder._id && <MoreHorizontal size={14} />}
        </button>
      ))}

      {isCreating && (
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
          <input 
            autoFocus
            type="text" 
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Folder name"
            style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", fontSize: "0.875rem" }}
          />
          <button onClick={handleCreate} style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "0 0.5rem", cursor: "pointer" }}>
            <Check size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
// Note: added missing Check import for the inline component
import { Check } from "lucide-react";
