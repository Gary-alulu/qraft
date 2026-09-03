"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { DEFAULT_QR_OPTIONS, analyzeScanability } from "@/lib/qr-engine";

export default function useQRGenerator(initialData = "https://qraft.app") {
  const [data, setData] = useState(initialData);
  const [options, setOptions] = useState(DEFAULT_QR_OPTIONS);
  const [qrInstance, setQrInstance] = useState(null);
  const qrRef = useRef(null);
  const debounceRef = useRef(null);

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

  // Download QR
  const download = useCallback(
    (extension = "png", name = "qraft-qr", size = 1024) => {
      if (!qrInstance) return;
      
      // Temporarily update size for export
      const originalWidth = options.width || 1024;
      const originalHeight = options.height || 1024;
      
      qrInstance.update({
        width: size,
        height: size,
      });

      // Give it a tiny bit of time to render the new size
      setTimeout(() => {
        qrInstance.download({ extension, name });
        // Revert back
        qrInstance.update({
          width: originalWidth,
          height: originalHeight,
        });
      }, 50);
    },
    [qrInstance, options.width, options.height]
  );

  // Get raw SVG string
  const getRawSvg = useCallback(async () => {
    if (!qrInstance) return null;
    const blob = await qrInstance.getRawData("svg");
    return await blob?.text();
  }, [qrInstance]);

  // Scanability score
  const scanability = analyzeScanability(options);

  return {
    data,
    setData,
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
