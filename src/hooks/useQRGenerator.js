"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { DEFAULT_QR_OPTIONS, analyzeScanability } from "@/lib/qr-engine";
import {
  QR_EXPORT_COVERAGE,
  calculateQRExportLayout,
  buildFramedSvg,
  triggerDownload,
} from "@/lib/qr-export";

export default function useQRGenerator(initialData = "https://qraft.app", externalContext = null) {
  const [data, setData] = useState(initialData);
  const [context, setContext] = useState(externalContext || {});
  const [options, setOptions] = useState(DEFAULT_QR_OPTIONS);
  const [qrInstance, setQrInstance] = useState(null);
  const qrRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync externalContext when provided
  useEffect(() => {
    if (externalContext) {
      setContext(externalContext);
    }
  }, [externalContext]);

  // Dynamically import qr-code-styling (client-only)
  useEffect(() => {
    let mounted = true;
    import("qr-code-styling").then((mod) => {
      if (!mounted) return;
      const QRCodeStyling = mod.default;
      const instance = new QRCodeStyling({
        ...options,
        data: data || "https://qraft.app",
      });
      setQrInstance(instance);
    });
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update QR when data or options change (debounced)
  useEffect(() => {
    if (!qrInstance) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      qrInstance.update({
        ...options,
        data: data || "https://qraft.app",
      });
    }, 150);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, options, qrInstance]);

  // Append QR to DOM ref
  const attachTo = useCallback(
    (element) => {
      if (!element || !qrInstance) return;
      qrRef.current = element;
      element.innerHTML = "";
      qrInstance.append(element);
    },
    [qrInstance]
  );

  // Update design options
  const updateOptions = useCallback((newOpts) => {
    setOptions((prev) => {
      const merged = { ...prev };
      for (const key of Object.keys(newOpts)) {
        if (typeof newOpts[key] === "object" && newOpts[key] !== null && !Array.isArray(newOpts[key])) {
          merged[key] = { ...prev[key], ...newOpts[key] };
        } else {
          merged[key] = newOpts[key];
        }
      }
      return merged;
    });
  }, []);

  // Download QR — renders the QR into a square export frame of the requested
  // resolution, centered and occupying 85% of the frame.
  const download = useCallback(
    async (extension = "png", name = "qraft-qr", size = 1024) => {
      if (!qrInstance) return;

      const canvasWidth = size || 1024;
      const canvasHeight = size || 1024;

      const originalWidth = options.width || 1024;
      const originalHeight = options.height || 1024;

      // Size the QR instance to target dimensions so its SVG output matches the
      // frame proportion.
      const { qrSize } = calculateQRExportLayout({
        canvasWidth,
        canvasHeight,
        coverage: QR_EXPORT_COVERAGE,
      });

      qrInstance.update({ width: qrSize, height: qrSize });
      await new Promise((r) => setTimeout(r, 30));

      // Grab the QR's own SVG element and serialize it.
      let svgString = null;
      try {
        const blob = await qrInstance.getRawData("svg");
        svgString = blob && typeof blob.text === "function" ? await blob.text() : blob;
      } catch {
        svgString = null;
      }

      const restore = () =>
        qrInstance.update({ width: originalWidth, height: originalHeight });

      if (!svgString) {
        restore();
        return;
      }

      if (extension === "svg") {
        // SVG export: build a framed SVG with the QR centered at 85%.
        // Standalone SVG documents render nested data-URI images fine.
        const framedSvg = buildFramedSvg({
          qrSvgString: svgString,
          canvasWidth,
          canvasHeight,
          coverage: QR_EXPORT_COVERAGE,
        });
        triggerDownload(framedSvg, "image/svg+xml", `${name}.svg`);
        restore();
        return;
      }

      // Raster formats (PNG/JPG/WebP): draw the QR directly onto a canvas
      // instead of rasterizing an SVG-within-SVG (which can fail and produce a
      // blank image). The export canvas is the source of truth for size.
      const layout = calculateQRExportLayout({
        canvasWidth,
        canvasHeight,
        coverage: QR_EXPORT_COVERAGE,
      });

      const frame = document.createElement("canvas");
      frame.width = canvasWidth;
      frame.height = canvasHeight;
      const ctx = frame.getContext("2d");
      if (!ctx) {
        restore();
        return;
      }
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const qrImg = new Image();
      const mime =
        extension === "jpeg"
          ? "image/jpeg"
          : extension === "webp"
            ? "image/webp"
            : "image/png";

      qrImg.onload = () => {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(qrImg, layout.x, layout.y, layout.qrSize, layout.qrSize);
        frame.toBlob(
          (blob) => {
            if (!blob) return;
            triggerDownload(blob, mime, `${name}.${extension}`);
            restore();
          },
          mime,
          extension === "jpeg" ? 0.95 : undefined
        );
      };
      qrImg.onerror = () => {
        restore();
      };
      qrImg.src =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
    },
    [qrInstance, options.width, options.height]
  );

  // Get raw SVG string
  const getRawSvg = useCallback(async () => {
    if (!qrInstance) return null;
    const blob = await qrInstance.getRawData("svg");
    return await blob?.text();
  }, [qrInstance]);

  // Scanability score accurately computed with options, data, and form/upload context
  const scanability = analyzeScanability(options, data, externalContext || context);

  return {
    data,
    setData,
    context,
    setContext,
    options,
    setOptions,
    updateOptions,
    attachTo,
    download,
    getRawSvg,
    scanability,
    qrInstance,
  };
}
