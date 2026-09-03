"use client";

import { useState, useRef, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { Globe, Wifi, Contact, Mail, Calendar, FileText, Upload, Check, Loader2, X } from "lucide-react";
import { DATA_BUILDERS } from "@/lib/qr-data-builders";
import { storage, isFirebaseConfigured } from "@/lib/firebase";

export default function QRTypeSelector({ activeType, setActiveType, formData, setFormData, onGenerate, isDynamic, setIsDynamic }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [firebaseReady, setFirebaseReady] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFirebaseReady(isFirebaseConfigured());
  }, []);

  const types = [
    { id: "website", label: "Website", Icon: Globe },
    { id: "wifi", label: "Wi-Fi", Icon: Wifi },
    { id: "vcard", label: "vCard", Icon: Contact },
    { id: "email", label: "Email", Icon: Mail },
    { id: "event", label: "Event", Icon: Calendar },
    { id: "document", label: "Document", Icon: FileText },
  ];

  const handleDataChange = (field, value) => {
    setFormData(prev => ({ ...prev, [activeType]: { ...prev[activeType], [field]: value } }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      if (!isFirebaseConfigured()) {
        throw new Error("Firebase Storage is not configured. Add your Firebase keys to continue.");
      }

      if (!file.type || file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File exceeds 10MB limit");
      }

      // Upload directly from the browser to Firebase Storage. This bypasses
      // Vercel's 4.5MB serverless request limit entirely.
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `qrfiles/${Date.now()}-${safeName}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file, {
        contentType: "application/pdf",
      });

      const downloadUrl = await getDownloadURL(storageRef);

      handleDataChange("url", downloadUrl);
      handleDataChange("filename", file.name);
      handleDataChange("fileId", storagePath);
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    handleDataChange("url", "");
    handleDataChange("filename", "");
    handleDataChange("fileId", "");
    setUploadError(null);
  };

  const handleGenerateClick = () => {
    const builder = DATA_BUILDERS[activeType];
    const dataString = builder(formData[activeType] || {});
    onGenerate(dataString);
  };

  const renderForm = () => {
    const data = formData[activeType] || {};

    switch (activeType) {
      case "website":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              label="URL"
              placeholder="https://example.com"
              value={data.url || ""}
              onChange={(e) => handleDataChange("url", e.target.value)}
            />
          </div>
        );
      case "wifi":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input
              label="Network Name (SSID)"
              value={data.ssid || ""}
              onChange={(e) => handleDataChange("ssid", e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              value={data.password || ""}
              onChange={(e) => handleDataChange("password", e.target.value)}
            />
          </div>
        );
      case "vcard":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Input label="First Name" value={data.firstName || ""} onChange={(e) => handleDataChange("firstName", e.target.value)} style={{ flex: 1 }} />
              <Input label="Last Name" value={data.lastName || ""} onChange={(e) => handleDataChange("lastName", e.target.value)} style={{ flex: 1 }} />
            </div>
            <Input label="Phone" type="tel" value={data.phone || ""} onChange={(e) => handleDataChange("phone", e.target.value)} />
            <Input label="Email" type="email" value={data.email || ""} onChange={(e) => handleDataChange("email", e.target.value)} />
            <Input label="Company" value={data.company || ""} onChange={(e) => handleDataChange("company", e.target.value)} />
          </div>
        );
      case "document":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />

            {data.fileId ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem",
                borderRadius: "var(--radius-lg)",
                background: "rgba(16, 185, 129, 0.05)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "var(--radius-md)",
                  background: "rgba(16, 185, 129, 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Check size={20} style={{ color: "var(--color-success)" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {data.filename}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                    PDF uploaded — QR will link to this file
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--color-text-muted)", padding: "0.25rem",
                    borderRadius: "var(--radius-sm)", flexShrink: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !firebaseReady}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                  padding: "2rem 1rem",
                  borderRadius: "var(--radius-lg)",
                  border: "2px dashed var(--color-border)",
                  background: uploadError ? "rgba(239, 68, 68, 0.03)" : "var(--color-bg)",
                  cursor: uploading || !firebaseReady ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!uploading && firebaseReady) e.currentTarget.style.borderColor = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  if (!uploading && firebaseReady) e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                {uploading ? (
                  <Loader2 size={28} style={{ color: "var(--color-primary)", animation: "spin 1s linear infinite" }} />
                ) : (
                  <Upload size={28} style={{ color: uploadError || !firebaseReady ? "var(--color-error)" : "var(--color-text-muted)" }} />
                )}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
                    {uploading ? "Uploading..." : !firebaseReady ? "Storage not configured" : "Upload PDF"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                    PDF up to 10MB
                  </div>
                </div>
              </button>
            )}

            {!firebaseReady && !data.fileId && (
              <div style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
              }}>
                Set your Firebase Storage keys (NEXT_PUBLIC_FIREBASE_*) in .env.local / Vercel to enable PDF uploads.
              </div>
            )}

            {uploadError && (
              <div style={{
                fontSize: "0.8125rem",
                color: "var(--color-error)",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(239, 68, 68, 0.05)",
                border: "1px solid rgba(239, 68, 68, 0.15)",
              }}>
                {uploadError}
              </div>
            )}

            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
              Scanning this QR code will open or download the uploaded PDF.
            </div>
          </div>
        );
      default:
        return <div>Form not implemented yet for {activeType}</div>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}>Content</h2>

      {/* Dynamic Toggle */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        background: isDynamic ? "rgba(0, 212, 255, 0.05)" : "var(--color-bg)",
        borderRadius: "var(--radius-lg)",
        border: isDynamic ? "1px solid rgba(0, 212, 255, 0.3)" : "1px solid var(--color-border)",
        marginBottom: "1.5rem",
        transition: "all 0.2s ease",
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--color-text)" }}>Dynamic QR</div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
            {isDynamic ? "Trackable & editable after print" : "Static — data baked into the code"}
          </div>
        </div>
        <Toggle checked={isDynamic} onChange={setIsDynamic} />
      </div>

      {/* If dynamic, show a title field */}
      {isDynamic && (
        <div style={{ marginBottom: "1.5rem" }}>
          <Input
            label="QR Code Name"
            placeholder="e.g. Summer Sale Campaign"
            value={formData._title || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, _title: e.target.value }))}
          />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "2rem" }}>
        {types.map(t => (
           <button
             key={t.id}
             onClick={() => setActiveType(t.id)}
             style={{
               display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", borderRadius: "var(--radius-md)",
               background: activeType === t.id ? "rgba(30, 58, 95, 0.05)" : "transparent",
               border: activeType === t.id ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
               color: activeType === t.id ? "var(--color-primary)" : "var(--color-text)",
               fontWeight: activeType === t.id ? 600 : 400,
               cursor: "pointer"
             }}
           >
             <span style={{ display: "inline-flex", color: activeType === t.id ? "var(--color-primary)" : "var(--color-text-muted)" }}>
               <t.Icon size={20} strokeWidth={2} />
             </span>
             {t.label}
           </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {renderForm()}
      </div>

      <div style={{ paddingTop: "2rem", marginTop: "2rem", borderTop: "1px solid var(--color-border-light)" }}>
         <Button variant="primary" style={{ width: "100%" }} onClick={handleGenerateClick}>Generate QR Code</Button>
      </div>
    </div>
  );
}
