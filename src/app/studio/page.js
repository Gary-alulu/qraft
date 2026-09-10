"use client";

import { useState, useCallback, useEffect, useMemo, useRef, Suspense } from "react";
import { useSession } from "@/components/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import StudioLayout from "@/components/studio/StudioLayout";
import QRTypeSelector from "@/components/studio/QRTypeSelector";
import QRPreview from "@/components/studio/QRPreview";
import DesignPanel from "@/components/studio/DesignPanel";
import Button from "@/components/ui/Button";
import UserAvatar from "@/components/ui/UserAvatar";
import FirstQRCelebration from "@/components/studio/FirstQRCelebration";
import useQRGenerator from "@/hooks/useQRGenerator";
import useMediaQuery from "@/hooks/useMediaQuery";

/** Build a Gravatar URL client-side using Web Crypto (no Node.js needed) */
async function buildGravatarUrl(email, size = 64) {
  if (!email || typeof crypto === "undefined" || !crypto.subtle) return "";
  const normalized = email.trim().toLowerCase();
  const encoded = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  // Gravatar actually uses MD5, but SHA-256 is not supported by Gravatar.
  // Instead we use the ?d=mp fallback and still show initials from UserAvatar
  // when no Gravatar is found. For real MD5 we rely on the server-side path.
  // On the client, pass an empty string to gracefully fall back to initials.
  return "";
}

function StudioContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const editId = searchParams.get("edit");
  const typeParam = searchParams.get("type");
  const dynamicParam = searchParams.get("dynamic") === "1";

  const [activeType, setActiveType] = useState(typeParam || "website");
  const [formData, setFormData] = useState({});
  const [isDynamic, setIsDynamic] = useState(dynamicParam);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(!!editId);
  const [showCelebration, setShowCelebration] = useState(false);
  const [savedSlug, setSavedSlug] = useState(null);

  // Refs mirror the latest render values so background async work (auto-track)
  // never reads stale state.
  const sessionRef = useRef(session);
  const activeTypeRef = useRef(activeType);
  const formDataRef = useRef(formData);
  const isDynamicRef = useRef(isDynamic);
  const editIdRef = useRef(editId);
  const savedSlugRef = useRef(savedSlug);
  const optionsRef = useRef(null);
  const qrInstanceRef = useRef(null);
  const autoTrackLockRef = useRef(false);
  const autoTrackTimerRef = useRef(null);

  const scanabilityContext = useMemo(() => ({
    type: activeType,
    contentData: formData[activeType] || {},
    isDynamic,
  }), [activeType, formData, isDynamic]);

  const { data, setData, options, updateOptions, attachTo, download, scanability, qrInstance } = useQRGenerator("https://qraft.app", scanabilityContext);

  sessionRef.current = session;
  activeTypeRef.current = activeType;
  formDataRef.current = formData;
  isDynamicRef.current = isDynamic;
  editIdRef.current = editId;
  savedSlugRef.current = savedSlug;
  optionsRef.current = options;
  qrInstanceRef.current = qrInstance;

  const handleGenerate = useCallback((newDataString) => {
    setData(newDataString);
    if (autoTrackTimerRef.current) clearTimeout(autoTrackTimerRef.current);
    autoTrackTimerRef.current = setTimeout(runAutoTrack, 800);
  }, [setData, runAutoTrack]);

  useEffect(() => () => {
    if (autoTrackTimerRef.current) clearTimeout(autoTrackTimerRef.current);
  }, []);

  // Create/refresh the backend record for a generated dynamic QR automatically
  // so tracking data appears on the dashboard without an explicit save. Runs a
  // debounce after the last generation event; once a record exists, later
  // generations update it (PUT) instead of creating duplicates.
  const runAutoTrack = useCallback(async () => {
    if (autoTrackLockRef.current) return;

    const dyn = isDynamicRef.current;
    const content = formDataRef.current[activeTypeRef.current] || {};
    const rawDest = (content.url || "").trim();
    if (!dyn || rawDest === "https://qraft.app" || !/^https?:\/\/[^\s]+$/i.test(rawDest)) return;
    if (!sessionRef.current) return;

    const editIdNow = editIdRef.current;
    autoTrackLockRef.current = true;
    try {
      const title = formDataRef.current._title ||
        `${activeTypeRef.current.charAt(0).toUpperCase() + activeTypeRef.current.slice(1)} QR Code`;

      const res = await fetch(editIdNow ? `/api/qrcodes/${editIdNow}` : "/api/qrcodes", {
        method: editIdNow ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type: activeTypeRef.current,
          contentData: content,
          isDynamic: true,
          destinationUrl: rawDest,
          designOptions: optionsRef.current,
        }),
      });
      if (!res.ok) return;

      const result = await res.json();
      const shortSlug = result.data?.shortSlug;
      if (shortSlug) {
        savedSlugRef.current = shortSlug;
        const dynamicUrl = `${window.location.origin}/r/${shortSlug}`;
        setData(dynamicUrl);
        qrInstanceRef.current?.update({ ...optionsRef.current, data: dynamicUrl });
        if (!editIdNow) {
          editIdRef.current = result.data._id;
          router.replace(`/studio?edit=${result.data._id}`);
        }
      }
    } catch (err) {
      console.error("Auto-track save failed:", err);
    } finally {
      autoTrackLockRef.current = false;
    }
  }, [router, setData]);

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
          setSavedSlug(qr.shortSlug || null);
        }
      } catch (err) {
        console.error("Failed to load QR configuration for edit", err);
      } finally {
        setLoadingConfig(false);
      }
    }
    fetchQR();
  }, [editId, updateOptions, setData]);

  const handleSave = useCallback(async () => {
    if (!session) {
      const studioPath = window.location.pathname + window.location.search;
      router.push(`/login?next=${encodeURIComponent(studioPath)}`);
      return false;
    }

    setSaving(true);
    setSaveStatus(null);

    try {
      // Wait for any in-flight auto-track create to settle so a manual save
      // reuses the same record instead of creating a duplicate.
      if (autoTrackLockRef.current) {
        const deadline = Date.now() + 2000;
        while (autoTrackLockRef.current && Date.now() < deadline) {
          await new Promise((r) => setTimeout(r, 100));
        }
      }
      const effectiveEditId = editIdRef.current || editId;

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

      const method = effectiveEditId ? "PUT" : "POST";
      const url = effectiveEditId ? `/api/qrcodes/${effectiveEditId}` : "/api/qrcodes";

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

      const shortSlug = result.data?.shortSlug || null;
      if (shortSlug) {
        setSavedSlug(shortSlug);
      }

      if (isDynamic && shortSlug) {
        const dynamicUrl = `${window.location.origin}/r/${shortSlug}`;
        setData(dynamicUrl);
        qrInstance?.update({ ...options, data: dynamicUrl });
        if (!effectiveEditId) {
          router.replace(`/studio?edit=${result.data._id}`);
        }
      }

      // Trigger first-QR-of-the-day celebration if the backend says so.
      // localStorage acts as a same-session guard so we never re-show within
      // the same browser tab after dismissal, even on repeated saves.
      if (!editId && result.isFirstQRToday) {
        const today = new Date().toISOString().slice(0, 10);
        const lastCelebration = typeof window !== "undefined"
          ? localStorage.getItem("qraft_last_celebration")
          : null;
        if (lastCelebration !== today) {
          if (typeof window !== "undefined") {
            localStorage.setItem("qraft_last_celebration", today);
          }
          setShowCelebration(true);
        }
      }

      setTimeout(() => setSaveStatus(null), 3000);
      return true;
    } catch (err) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Save failed");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 4000);
      return false;
    } finally {
      setSaving(false);
    }
  }, [session, router, formData, activeType, isDynamic, editId, options, qrInstance, setData]);

  const handleDownload = useCallback(async (extension, name, size, quality) => {
    if (isDynamic && !savedSlug) {
      const ok = await handleSave();
      if (!ok) return;
    }
    await download(extension, name, size, quality);
  }, [isDynamic, savedSlug, handleSave, download]);

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
        display: "flex", alignItems: "center", justifyContent: "space-between", padding: isMobile ? "0 0.875rem" : "0 1.5rem", gap: "0.5rem"
      }}>
        <Link href="/" style={{ textDecoration: "none", color: "var(--color-primary)", fontWeight: 700, fontSize: isMobile ? "1rem" : "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", minWidth: 0, flexShrink: 1 }}>
          <Image src="/images/nav-logo.png" alt="QRAFT" width={3652} height={1418} style={{ height: isMobile ? "18px" : "22px", width: "auto", display: "block", maxWidth: isMobile ? "120px" : "none" }} />
          {!isMobile && editId && (
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-secondary)" }}>(Editing)</span>
          )}
        </Link>
        <div style={{ display: "flex", gap: isMobile ? "0.5rem" : "0.75rem", alignItems: "center", flexShrink: 0 }}>
          <AnimatePresence>
            {!isMobile && saveStatus === "success" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", padding: "0.5rem 1rem", borderRadius: "var(--radius-pill)", fontSize: "0.875rem", fontWeight: 500 }}
              >
                <Check size={16} /> {editId ? "Changes Saved" : "Saved to Dashboard"}
              </motion.div>
            )}
            {!isMobile && saveStatus === "error" && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.1)", color: "var(--color-error)", padding: "0.5rem 1rem", borderRadius: "var(--radius-pill)", fontSize: "0.875rem", fontWeight: 500 }}
              >
                <AlertCircle size={16} /> {errorMessage || "Save failed"}
              </motion.div>
            )}
          </AnimatePresence>
          <Button variant="accent" size="sm" onClick={handleSave} loading={saving} style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
            {session ? (editId ? (isMobile ? "Update" : "Update QR Code") : (isMobile ? "Save" : "Save to Dashboard")) : (isMobile ? "Save" : "Sign in to Save")}
          </Button>
          {session ? (
            <a
              href="/dashboard"
              title="Go to dashboard"
              style={{ textDecoration: "none", display: "flex" }}
            >
              <UserAvatar
                name={session.user?.name || ""}
                gravatarSrc=""
                size={isMobile ? 28 : 32}
                style={{ cursor: "pointer", border: "1.5px solid var(--color-border-light)" }}
              />
            </a>
          ) : (
            !isMobile && (
              <a
                href={`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`}
                style={{ fontSize: "0.875rem", color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}
              >Sign In</a>
            )
          )}
        </div>
      </header>

      <StudioLayout
        leftPanel={<QRTypeSelector activeType={activeType} setActiveType={setActiveType} formData={formData} setFormData={setFormData} onGenerate={handleGenerate} isDynamic={isDynamic} setIsDynamic={setIsDynamic} />}
        centerPanel={<QRPreview qrRef={attachTo} scanability={scanability} onDownload={handleDownload} />}
        rightPanel={<DesignPanel options={options} updateOptions={updateOptions} />}
      />

      {/* First QR of the Day celebration */}
      <FirstQRCelebration
        visible={showCelebration}
        onDismiss={() => setShowCelebration(false)}
        onCreateAnother={() => {
          // Reset studio form state for a fresh QR
          setFormData({});
          setActiveType("website");
          router.replace("/studio");
        }}
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
