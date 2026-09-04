"use client";

import { useState, useRef, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Toggle from "@/components/ui/Toggle";
import { Check, Loader2, X } from "lucide-react";
import { DATA_BUILDERS } from "@/lib/qr-data-builders";
import { supabase, isSupabaseConfigured, DOCUMENTS_BUCKET } from "@/lib/supabase";

const categories = [
  {
    name: "Links",
    items: [
      { id: "website", label: "Website" },
      { id: "dynamic", label: "Dynamic URL" },
      { id: "landing_page", label: "Landing Page" },
      { id: "social", label: "Social Profile" },
      { id: "app_link", label: "App Link" },
    ],
  },
  {
    name: "Contact",
    items: [
      { id: "vcard", label: "vCard" },
      { id: "phone", label: "Phone" },
      { id: "email", label: "Email" },
      { id: "sms", label: "SMS" },
      { id: "whatsapp", label: "WhatsApp" },
    ],
  },
  {
    name: "Business",
    items: [
      { id: "business", label: "Business Profile" },
      { id: "review", label: "Reviews" },
      { id: "menu", label: "Menu" },
      { id: "product", label: "Product" },
      { id: "feedback", label: "Feedback" },
    ],
  },
  {
    name: "Events",
    items: [
      { id: "event", label: "Event" },
      { id: "calendar", label: "Calendar" },
      { id: "rsvp", label: "RSVP" },
      { id: "ticket", label: "Ticket" },
    ],
  },
  {
    name: "Payments",
    items: [
      { id: "payment_link", label: "Payment Link" },
      { id: "mpesa", label: "M-Pesa" },
      { id: "paypal", label: "PayPal" },
    ],
  },
  {
    name: "Utilities",
    items: [
      { id: "wifi", label: "Wi-Fi" },
      { id: "location", label: "Location" },
      { id: "text", label: "Text" },
      { id: "document", label: "PDF / File" },
    ],
  },
];

export default function QRTypeSelector({ activeType, setActiveType, formData, setFormData, onGenerate, isDynamic, setIsDynamic }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [supabaseReady, setSupabaseReady] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setSupabaseReady(isSupabaseConfigured());
  }, []);

  // Force dynamic for hosted types
  useEffect(() => {
    const hostedTypes = ["landing_page", "social", "app_link", "business", "review", "menu", "product", "feedback", "rsvp", "ticket"];
    if (hostedTypes.includes(activeType)) {
      setIsDynamic(true);
    }
  }, [activeType, setIsDynamic]);

  const handleDataChange = (field, value) => {
    setFormData(prev => ({ ...prev, [activeType]: { ...prev[activeType], [field]: value } }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error("Supabase Storage is not configured. Add your Supabase keys to continue.");
      }

      if (!file.type || file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File exceeds 10MB limit");
      }

      const urlRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, size: file.size }),
      });
      const urlData = await urlRes.json();
      if (!urlRes.ok) {
        throw new Error(urlData.error || "Could not start upload");
      }

      const { error: uploadError } = await supabase.storage
        .from(DOCUMENTS_BUCKET)
        .uploadToSignedUrl(urlData.path, urlData.token, file, {
          contentType: "application/pdf",
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Upload failed");
      }

      handleDataChange("url", urlData.publicUrl);
      handleDataChange("filename", file.name);
      handleDataChange("fileId", urlData.path);

      onGenerate(urlData.publicUrl);
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
    const dataString = builder ? builder(formData[activeType] || {}) : "";
    onGenerate(dataString);
  };

  const renderForm = () => {
    const data = formData[activeType] || {};

    switch (activeType) {
      case "website":
      case "dynamic":
      case "payment_link":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Destination URL" placeholder="https://example.com" value={data.url || ""} onChange={(e) => handleDataChange("url", e.target.value)} />
          </div>
        );
      case "landing_page":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Page Title" value={data.title || ""} onChange={(e) => handleDataChange("title", e.target.value)} />
            <Input label="Headline" value={data.headline || ""} onChange={(e) => handleDataChange("headline", e.target.value)} />
            <Input label="Description" value={data.description || ""} onChange={(e) => handleDataChange("description", e.target.value)} />
            <Input label="Button Text" value={data.btnText || ""} onChange={(e) => handleDataChange("btnText", e.target.value)} />
            <Input label="Button URL" value={data.url || ""} onChange={(e) => handleDataChange("url", e.target.value)} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>This generates a hosted mini landing page.</div>
          </div>
        );
      case "social":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Instagram Username" value={data.instagram || ""} onChange={(e) => handleDataChange("instagram", e.target.value)} />
            <Input label="X (Twitter) Username" value={data.twitter || ""} onChange={(e) => handleDataChange("twitter", e.target.value)} />
            <Input label="LinkedIn URL" value={data.linkedin || ""} onChange={(e) => handleDataChange("linkedin", e.target.value)} />
            <Input label="Website URL" value={data.website || ""} onChange={(e) => handleDataChange("website", e.target.value)} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Creates a page with all your social links.</div>
          </div>
        );
      case "app_link":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="iOS App URL" value={data.ios || ""} onChange={(e) => handleDataChange("ios", e.target.value)} />
            <Input label="Android App URL" value={data.android || ""} onChange={(e) => handleDataChange("android", e.target.value)} />
            <Input label="Fallback URL" value={data.url || ""} onChange={(e) => handleDataChange("url", e.target.value)} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Automatically redirects based on device OS.</div>
          </div>
        );
      case "wifi":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Network Name (SSID)" value={data.ssid || ""} onChange={(e) => handleDataChange("ssid", e.target.value)} />
            <Input label="Password" type="password" value={data.password || ""} onChange={(e) => handleDataChange("password", e.target.value)} />
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
      case "phone":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Phone Number" type="tel" value={data.phone || ""} onChange={(e) => handleDataChange("phone", e.target.value)} />
          </div>
        );
      case "email":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Email Address" type="email" value={data.to || ""} onChange={(e) => handleDataChange("to", e.target.value)} />
            <Input label="Subject" value={data.subject || ""} onChange={(e) => handleDataChange("subject", e.target.value)} />
            <Input label="Message" value={data.body || ""} onChange={(e) => handleDataChange("body", e.target.value)} />
          </div>
        );
      case "sms":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Phone Number" type="tel" value={data.phone || ""} onChange={(e) => handleDataChange("phone", e.target.value)} />
            <Input label="Message" value={data.message || ""} onChange={(e) => handleDataChange("message", e.target.value)} />
          </div>
        );
      case "whatsapp":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="WhatsApp Number" type="tel" placeholder="+1234567890" value={data.phone || ""} onChange={(e) => handleDataChange("phone", e.target.value)} />
            <Input label="Pre-filled Message" value={data.message || ""} onChange={(e) => handleDataChange("message", e.target.value)} />
          </div>
        );
      case "business":
      case "product":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Name" value={data.name || ""} onChange={(e) => handleDataChange("name", e.target.value)} />
            <Input label="Description" value={data.description || ""} onChange={(e) => handleDataChange("description", e.target.value)} />
            <Input label="Website URL" value={data.url || ""} onChange={(e) => handleDataChange("url", e.target.value)} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Creates a mobile-friendly profile page.</div>
          </div>
        );
      case "review":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Business Name" value={data.name || ""} onChange={(e) => handleDataChange("name", e.target.value)} />
            <Input label="Review Platform URL (Google, Yelp, etc.)" value={data.url || ""} onChange={(e) => handleDataChange("url", e.target.value)} />
          </div>
        );
      case "menu":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Restaurant Name" value={data.name || ""} onChange={(e) => handleDataChange("name", e.target.value)} />
            <Input label="Menu PDF URL" value={data.url || ""} onChange={(e) => handleDataChange("url", e.target.value)} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>For a full digital menu builder, use our dashboard tools.</div>
          </div>
        );
      case "feedback":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Question / Prompt" placeholder="How was your experience?" value={data.question || ""} onChange={(e) => handleDataChange("question", e.target.value)} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Collects user feedback via a Qraft hosted form.</div>
          </div>
        );
      case "event":
      case "calendar":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Event Name" value={data.title || ""} onChange={(e) => handleDataChange("title", e.target.value)} />
            <Input label="Start Date/Time" type="datetime-local" value={data.start || ""} onChange={(e) => handleDataChange("start", e.target.value)} />
            <Input label="End Date/Time" type="datetime-local" value={data.end || ""} onChange={(e) => handleDataChange("end", e.target.value)} />
            <Input label="Location" value={data.location || ""} onChange={(e) => handleDataChange("location", e.target.value)} />
            <Input label="Description" value={data.description || ""} onChange={(e) => handleDataChange("description", e.target.value)} />
          </div>
        );
      case "rsvp":
      case "ticket":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Event Name" value={data.title || ""} onChange={(e) => handleDataChange("title", e.target.value)} />
            <Input label="Event URL" value={data.url || ""} onChange={(e) => handleDataChange("url", e.target.value)} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>This will create a Qraft-hosted event management page.</div>
          </div>
        );
      case "mpesa":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="Till Number / Paybill" value={data.till || ""} onChange={(e) => handleDataChange("till", e.target.value)} />
            <Input label="Amount (Optional)" type="number" value={data.amount || ""} onChange={(e) => handleDataChange("amount", e.target.value)} />
          </div>
        );
      case "paypal":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Input label="PayPal Username" placeholder="username" value={data.username || ""} onChange={(e) => handleDataChange("username", e.target.value)} />
            <Input label="Amount (Optional)" type="number" value={data.amount || ""} onChange={(e) => handleDataChange("amount", e.target.value)} />
          </div>
        );
      case "location":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Input label="Latitude" type="number" step="any" value={data.lat || ""} onChange={(e) => handleDataChange("lat", e.target.value)} style={{ flex: 1 }} />
              <Input label="Longitude" type="number" step="any" value={data.lng || ""} onChange={(e) => handleDataChange("lng", e.target.value)} style={{ flex: 1 }} />
            </div>
          </div>
        );
      case "text":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text)" }}>Plain Text</span>
              <textarea 
                value={data.text || ""} 
                onChange={(e) => handleDataChange("text", e.target.value)}
                style={{
                  width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-text)", fontSize: "0.9375rem", outline: "none", minHeight: "120px", resize: "vertical"
                }}
              />
            </label>
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
                disabled={uploading || !supabaseReady}
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
                  cursor: uploading || !supabaseReady ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!uploading && supabaseReady) e.currentTarget.style.borderColor = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  if (!uploading && supabaseReady) e.currentTarget.style.borderColor = "var(--color-border)";
                }}
              >
                {uploading ? (
                  <Loader2 size={28} style={{ color: "var(--color-primary)", animation: "spin 1s linear infinite" }} />
                ) : (
                  <div style={{ width: 28, height: 28, background: "var(--color-border)", borderRadius: "4px" }} />
                )}
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
                    {uploading ? "Uploading..." : !supabaseReady ? "Storage not configured" : "Upload PDF"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                    PDF up to 10MB
                  </div>
                </div>
              </button>
            )}

            {!supabaseReady && !data.fileId && (
              <div style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(245, 158, 11, 0.08)",
                border: "1px solid rgba(245, 158, 11, 0.25)",
              }}>
                Set your Supabase Storage keys (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local / Vercel to enable PDF uploads.
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
          </div>
        );
      default:
        return <div>Form not implemented yet for {activeType}</div>;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}>Content</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "0.5rem" }}>QR Type</label>
        <select 
          value={activeType} 
          onChange={e => setActiveType(e.target.value)} 
          style={{ 
            width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", 
            background: "var(--color-surface)", color: "var(--color-text)", fontSize: "0.9375rem", outline: "none", cursor: "pointer" 
          }}
        >
          {categories.map(cat => (
            <optgroup key={cat.name} label={cat.name}>
              {cat.items.map(item => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

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

      <div style={{ flex: 1, overflowY: "auto", paddingRight: "0.5rem", paddingBottom: "1rem" }}>
        {renderForm()}
      </div>

      <div style={{ paddingTop: "1.5rem", marginTop: "auto", borderTop: "1px solid var(--color-border-light)" }}>
         <Button variant="primary" style={{ width: "100%" }} onClick={handleGenerateClick}>Generate QR Code</Button>
      </div>
    </div>
  );
}
