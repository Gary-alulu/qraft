"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export default function LogoUploader({ options, updateOptions }) {
  const [preview, setPreview] = useState(options?.image || null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        setPreview(dataUrl);
        updateOptions({ image: dataUrl });
      };
      reader.readAsDataURL(file);
    },
    [updateOptions]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer?.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const removeLogo = () => {
    setPreview(null);
    updateOptions({ image: "" });
    if (inputRef.current) inputRef.current.value = "";
  };

  const logoSize = options?.imageOptions?.imageSize ?? 0.4;
  const logoMargin = options?.imageOptions?.margin ?? 8;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        style={{
          position: "relative",
          border: `2px dashed ${dragActive ? "var(--color-secondary)" : preview ? "var(--color-success)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: preview ? "1rem" : "2rem 1.5rem",
          textAlign: "center",
          cursor: "pointer",
          background: dragActive
            ? "rgba(0, 212, 255, 0.05)"
            : preview
            ? "rgba(16, 185, 129, 0.03)"
            : "var(--color-bg)",
          transition: "all 0.2s ease",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {preview ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                border: "1px solid var(--color-border-light)",
                flexShrink: 0,
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={preview}
                alt="Logo preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                Logo uploaded
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                }}
              >
                Click to replace
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeLogo();
              }}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-muted)",
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "var(--radius-lg)",
                background: "rgba(0, 212, 255, 0.08)",
                color: "var(--color-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 0.75rem",
              }}
            >
              <Upload size={22} />
            </div>
            <div
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                color: "var(--color-text)",
                marginBottom: "0.25rem",
              }}
            >
              Drop your logo here
            </div>
            <div
              style={{
                fontSize: "0.8125rem",
                color: "var(--color-text-muted)",
              }}
            >
              or click to browse · PNG, JPG, SVG, WebP
            </div>
          </>
        )}
      </div>

      {/* Controls (only show when logo is uploaded) */}
      {preview && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Size */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                Logo Size
              </label>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {Math.round(logoSize * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.5"
              step="0.05"
              value={logoSize}
              onChange={(e) =>
                updateOptions({
                  imageOptions: { imageSize: parseFloat(e.target.value) },
                })
              }
              style={{ width: "100%", cursor: "pointer", accentColor: "var(--color-secondary)" }}
            />
          </div>

          {/* Padding */}
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <label
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                Padding
              </label>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--color-text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {logoMargin}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="2"
              value={logoMargin}
              onChange={(e) =>
                updateOptions({
                  imageOptions: { margin: parseInt(e.target.value) },
                })
              }
              style={{ width: "100%", cursor: "pointer", accentColor: "var(--color-secondary)" }}
            />
          </div>

          {/* Shape */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-text)",
                marginBottom: "0.5rem",
              }}
            >
              Background Shape
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {[
                { id: "none", label: "None" },
                { id: "circle", label: "Circle" },
                { id: "square", label: "Square" },
              ].map((shape) => {
                const current =
                  options?.imageOptions?.hideBackgroundDots === false
                    ? "none"
                    : "circle"; // Default behavior
                return (
                  <button
                    key={shape.id}
                    onClick={() =>
                      updateOptions({
                        imageOptions: {
                          hideBackgroundDots: shape.id !== "none",
                        },
                      })
                    }
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-border)",
                      background: "transparent",
                      color: "var(--color-text)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {shape.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
