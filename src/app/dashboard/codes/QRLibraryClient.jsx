"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Grid, List, FolderPlus, Plus, X, QrCode } from "lucide-react";
import Button from "@/components/ui/Button";
import RecentCodesTable from "@/components/dashboard/RecentCodesTable";
import QRFolderSidebar from "@/components/dashboard/QRFolderSidebar";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function QRLibraryClient({ initialFolders, initialCodes }) {
  const [codes, setCodes] = useState(initialCodes);
  const [folders, setFolders] = useState(initialFolders);
  const [activeFolder, setActiveFolder] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState("list");

  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderSaving, setFolderSaving] = useState(false);

  // --- Folder handlers ---
  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || folderSaving) return;
    setFolderSaving(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName }),
      });
      const result = await res.json();
      if (result.success) {
        setFolders(prev => [...prev, { _id: result.data._id, name: result.data.name, color: result.data.color }]);
      }
    } catch (e) {
      console.error("Create folder failed", e);
    } finally {
      setNewFolderName("");
      setIsCreatingFolder(false);
      setFolderSaving(false);
    }
  };

  // --- QR Code handlers (passed to table) ---
  const handleCodeUpdate = (updatedCode) => {
    setCodes(prev => prev.map(c => c.id === updatedCode.id ? { ...c, ...updatedCode } : c));
  };

  const handleCodeDelete = (deletedId) => {
    setCodes(prev => prev.filter(c => c.id !== deletedId));
  };

  // --- Filtering ---
  const filteredCodes = codes.filter(code => {
    if (activeFolder && code.folderId !== activeFolder) return false;
    if (search && !code.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterType === "dynamic" && code.isDynamic === false) return false;
    if (filterType === "static" && code.isDynamic === true) return false;
    if (filterType === "archived" && code.status !== "archived") return false;
    if (filterType !== "archived" && code.status === "archived") return false;
    return true;
  });

  return (
    <div className="library-layout">
      {/* Sidebar */}
      <div className="library-sidebar">
        <QRFolderSidebar 
          folders={folders} 
          activeFolder={activeFolder} 
          setActiveFolder={setActiveFolder} 
        />
        
        {/* Create Folder inline */}
        <div>
          {!isCreatingFolder ? (
            <Button variant="secondary" style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }} onClick={() => setIsCreatingFolder(true)}>
              <FolderPlus size={16} />
              New Folder
            </Button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <input 
                type="text" 
                placeholder="Folder name" 
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                autoFocus
                onKeyDown={e => {
                  if (e.key === "Enter") handleCreateFolder();
                  if (e.key === "Escape") setIsCreatingFolder(false);
                }}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-primary)", outline: "none", fontSize: "0.875rem" }}
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button size="sm" variant="primary" style={{ flex: 1 }} onClick={handleCreateFolder}>Save</Button>
                <Button size="sm" variant="secondary" onClick={() => setIsCreatingFolder(false)}>
                  <X size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="library-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text)" }}>
              My QR Codes
            </h1>
            <p style={{ color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
              {activeFolder ? `Viewing folder` : "Manage and track all your active QR campaigns."}
            </p>
          </div>
          <Button href="/studio" variant="primary" style={{ gap: "0.5rem" }}>
            <Plus size={18} />
            Create QR Code
          </Button>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
            background: "var(--color-surface)",
            padding: "1rem",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border-light)",
            flexWrap: "wrap"
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: "0.5rem", background: "rgba(0,0,0,0.03)", padding: "0.25rem", borderRadius: "var(--radius-lg)" }}>
            {[
              { id: "all", label: "All Codes" },
              { id: "dynamic", label: "Dynamic" },
              { id: "static", label: "Static" },
              { id: "archived", label: "Archived" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-md)",
                  border: "none",
                  background: filterType === tab.id ? "white" : "transparent",
                  color: filterType === tab.id ? "var(--color-text)" : "var(--color-text-muted)",
                  fontWeight: filterType === tab.id ? 600 : 500,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  boxShadow: filterType === tab.id ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1, justifyContent: "flex-end" }}>
            <div style={{ position: "relative", maxWidth: "240px", width: "100%" }}>
               <Search size={16} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
               <input 
                 type="text" 
                 placeholder="Search codes..." 
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                 style={{ 
                   width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", 
                   borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)",
                   background: "var(--color-bg)", outline: "none",
                   fontSize: "0.875rem"
                 }} 
               />
            </div>
            
            <div style={{ display: "flex", gap: "0.25rem", background: "var(--color-bg)", padding: "0.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
              <button onClick={() => setViewMode("list")} style={{ padding: "0.375rem", borderRadius: "4px", border: "none", background: viewMode === "list" ? "var(--color-surface)" : "transparent", color: viewMode === "list" ? "var(--color-text)" : "var(--color-text-muted)", cursor: "pointer", boxShadow: viewMode === "list" ? "var(--shadow-sm)" : "none" }}>
                <List size={18} />
              </button>
              <button onClick={() => setViewMode("grid")} style={{ padding: "0.375rem", borderRadius: "4px", border: "none", background: viewMode === "grid" ? "var(--color-surface)" : "transparent", color: viewMode === "grid" ? "var(--color-text)" : "var(--color-text-muted)", cursor: "pointer", boxShadow: viewMode === "grid" ? "var(--shadow-sm)" : "none" }}>
                <Grid size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {filteredCodes.length > 0 ? (
          viewMode === "list" ? (
            <RecentCodesTable codes={filteredCodes} onUpdate={handleCodeUpdate} onDelete={handleCodeDelete} />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {filteredCodes.map(code => (
                <div key={code.id} style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "40px", height: "40px", background: "rgba(0, 212, 255, 0.1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <QrCode size={20} color="var(--color-secondary)" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-text)" }}>{code.name}</h3>
                        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>{code.type}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", textTransform: "uppercase", fontWeight: 600 }}>Scans</span>
                      <span style={{ fontSize: "1.125rem", fontWeight: 700 }}>{code.scans.toLocaleString()}</span>
                    </div>
                    <Badge variant={code.status === "active" ? "success" : "warning"}>{code.status}</Badge>
                  </div>
                  
                  <div style={{ height: "1px", background: "var(--color-border-light)" }} />
                  
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                     <Link href={`/r/${code.id}`} style={{ fontSize: "0.8125rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: 500 }}>Test Link</Link>
                     <Link href={`/studio?edit=${code.id}`} style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 500 }}>Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={{ padding: "4rem", textAlign: "center", background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
             <p style={{ color: "var(--color-text-secondary)" }}>No QR codes found in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
