"use client";

import { useState, useCallback, useEffect, useMemo, Suspense } from "react";
import { useSession } from "@/components/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import StudioLayout from "@/components/studio/StudioLayout";
import QRTypeSelector from "@/components/studio/QRTypeSelector";
import QRPreview from "@/components/studio/QRPreview";
import DesignPanel from "@/components/studio/DesignPanel";
import Button from "@/components/ui/Button";
import useQRGenerator from "@/hooks/useQRGenerator";

function StudioContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const typeParam = searchParams.get("type");

  const [activeType, setActiveType] = useState(typeParam || "website");
  const [formData, setFormData] = useState({});
  const [isDynamic, setIsDynamic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(!!editId);

  const scanabilityContext = useMemo(() => ({
    type: activeType,
    contentData: formData[activeType] || {},
    isDynamic,
  }), [activeType, formData, isDynamic]);

  const { data, setData, options, updateOptions, attachTo, download, scanability } = useQRGenerator("https://qraft.app", scanabilityContext);

  // Load existing QR data if editing
  useEffect(() => {
    if (!editId) return;
    
    async function fetchQR() {
      try {
        const res = await fetch(`/api/qrcodes/${editId}`);
        const result = await res.json();
        
        if (result.success && result.data) {
          const qr = result.data;
          setActiveType(qr.type);
          setIsDynamic(qr.isDynamic);
          setFormData({
            _title: qr.title,
            [qr.type]: qr.contentData
          });
          
          if (qr.designId?.options) {
            updateOptions(qr.designId.options);
          }

          if (qr.isDynamic && qr.shortSlug) {
            setData(`${window.location.origin}/r/${qr.shortSlug}`);
          }
        }
      } catch (err) {
        console.error("Failed to load QR configuration for edit", err);
      } finally {
        setLoadingConfig(false);
      }
    }
    fetchQR();
  }, [editId, updateOptions, setData]);

  const handleGenerate = useCallback((newDataString) => {
    setData(newDataString);
  }, [setData]);

  const handleSave = async () => {
    if (!session) {
      const studioPath = window.location.pathname + window.location.search;
      router.push(`/login?next=${encodeURIComponent(studioPath)}`);
      return;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      const contentData = formData[activeType] || {};
      const title = formData._title || `${activeType.charAt(0).toUpperCase() + activeType.slice(1)} QR Code`;
      
      let destinationUrl = null;
      if (isDynamic) {
        if (activeType === "website") {
          destinationUrl = contentData.url || "https://qraft.app";
        } else if (activeType === "document" && contentData.url) {
          // For dynamic document QRs, resolve the file URL to a full origin URL
          // so the redirect engine can forward to it.
          destinationUrl = contentData.url.startsWith("http")
            ? contentData.url
            : `${window.location.origin}${contentData.url}`;
        }
      }

      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/qrcodes/${editId}` : "/api/qrcodes";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type: activeType,
          contentData,
          isDynamic,
          destinationUrl,
          designOptions: options,
        }),
      });

      if (!res.ok) {
        let message = "Failed to save";
        try {
          const errBody = await res.json();
          if (errBody?.error) message = errBody.error;
        } catch {}
        throw new Error(message);
      }

      const result = await res.json();
      setSaveStatus("success");

      if (!editId && isDynamic && result.data?.shortSlug) {
        const dynamicUrl = `${window.location.origin}/r/${result.data.shortSlug}`;
        setData(dynamicUrl);
        // Optionally update URL to edit mode
        router.replace(`/studio?edit=${result.data._id}`);
      }

      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Save failed");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  if (loadingConfig) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ 
        height: "64px", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-light)", 
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem" 
      }}>
        <Link href="/" style={{ textDecoration: "none", color: "var(--color-primary)", fontWeight: 700, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "0.75rem" }}>Q</span>
          </div>
          QRAFT Studio {editId ? "(Editing)" : ""}
        </Link>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <AnimatePresence>
            {saveStatus === "success" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", padding: "0.5rem 1rem", borderRadius: "var(--radius-pill)", fontSize: "0.875rem", fontWeight: 500 }}
              >
                <Check size={16} /> {editId ? "Changes Saved" : "Saved to Dashboard"}
              </motion.div>
            )}
            {saveStatus === "error" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.1)", color: "var(--color-error)", padding: "0.5rem 1rem", borderRadius: "var(--radius-pill)", fontSize: "0.875rem", fontWeight: 500 }}
              >
                <AlertCircle size={16} /> {errorMessage || "Save failed"}
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="accent" size="sm" onClick={handleSave} loading={saving} style={{ fontWeight: 600 }}>
            {session ? (editId ? "Update QR Code" : "Save to Dashboard") : "Sign in to Save"}
          </Button>
          {session ? (
            <a
              href="/dashboard"
              title="Go to dashboard"
              style={{ textDecoration: "none" }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--color-primary-light)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"} onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}>
                {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </a>
          ) : (
            <a
              href={`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`}
              style={{ fontSize: "0.875rem", color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}
            >Sign In</a>
          )}
        </div>
      </header>

      <StudioLayout
        leftPanel={<QRTypeSelector activeType={activeType} setActiveType={setActiveType} formData={formData} setFormData={setFormData} onGenerate={handleGenerate} isDynamic={isDynamic} setIsDynamic={setIsDynamic} />}
        centerPanel={<QRPreview qrRef={attachTo} scanability={scanability} onDownload={download} />}
        rightPanel={<DesignPanel options={options} updateOptions={updateOptions} />}
      />
    </div>
  );
}

export default function Studio() {
  return (
    <Suspense fallback={<div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="animate-spin" size={32} color="var(--color-primary)" /></div>}>
      <StudioContent />
    </Suspense>
  );
}
