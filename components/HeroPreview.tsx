"use client";

import { useState } from "react";

export default function HeroPreview({
  src = "/assets/app-preview.gif",
  alt = "ScanSnap in action"
}: { src?: string; alt?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // SVG fallback – no external request, keeps layout stable
    return (
      <div style={{ width:"100%", height:"min(62vh,520px)", background:"#0f141a", display:"grid", placeItems:"center" }}>
        <svg width="100%" height="100%" viewBox="0 0 1200 800" role="img" aria-label="Preview placeholder">
          <rect width="1200" height="800" fill="#0f141a"/>
          <text x="50%" y="50%" fill="#9aa3b2" fontSize="24" textAnchor="middle" dominantBaseline="middle"
                fontFamily="system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,'Helvetica Neue',Arial">
            App preview GIF placeholder
          </text>
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ width:"100%", height:"min(62vh,520px)", objectFit:"cover", background:"#0f141a" }}
    />
  );
}
