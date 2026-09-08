"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * UserAvatar
 *
 * Displays a user's Gravatar photo if available, falling back
 * to a styled initials circle that matches Qraft's design system.
 *
 * Props:
 *   name       {string}  – display name (used for initials fallback + alt text)
 *   email      {string}  – user email (passed from server; Gravatar URL is built server-side)
 *   gravatarSrc {string} – pre-built Gravatar URL (built server-side via lib/gravatar.js)
 *   size       {number}  – diameter in px, default 36
 *   className  {string}  – extra CSS classes
 *   style      {object}  – extra inline styles
 */
export default function UserAvatar({
  name = "",
  gravatarSrc = "",
  size = 36,
  className = "",
  style = {},
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const initial = name?.charAt(0)?.toUpperCase() || "U";

  // Show initials if no Gravatar URL was provided or if the image failed to load
  const showInitials = !gravatarSrc || imgFailed;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    ...style,
  };

  if (showInitials) {
    return (
      <div
        className={className}
        style={{
          ...containerStyle,
          background: "linear-gradient(135deg, #1E3A5F 0%, #2B4F7E 100%)",
          color: "white",
          fontWeight: 600,
          fontSize: Math.round(size * 0.4),
          fontFamily: "var(--font-body, Inter, system-ui, sans-serif)",
          letterSpacing: "0.02em",
          userSelect: "none",
        }}
        title={name}
        aria-label={`${name}'s avatar`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={className} style={containerStyle} title={name} aria-label={`${name}'s avatar`}>
      <Image
        src={gravatarSrc}
        alt={name || "User avatar"}
        width={size}
        height={size}
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
        onError={() => setImgFailed(true)}
        unoptimized // Gravatar is an external URL; skip Next.js image optimiser
      />
    </div>
  );
}
