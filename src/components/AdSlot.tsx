"use client";

import { useEffect, useRef, useState } from "react";

interface AdSlotProps {
  slotId: string;
  className?: string;
  style?: React.CSSProperties;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: "true" | "false";
}

export default function AdSlot({
  slotId,
  className = "",
  style,
  format = "auto",
  responsive = "true",
}: AdSlotProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  // In development, we show a placeholder. 
  // In production, when AdSense is approved, this would render the actual ad.
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className={`my-8 flex justify-center w-full ${className}`} style={style}>
      {isDev ? (
        <div className="bg-[var(--card)] border border-[var(--border)] border-dashed rounded-xl flex flex-col items-center justify-center w-full min-h-[120px] max-w-[728px] p-4 text-center opacity-70">
          <span className="text-[10px] uppercase tracking-wider text-[var(--muted-light)] mb-1 font-semibold">
            Advertisement Placeholder
          </span>
          <span className="text-xs text-[var(--muted)] font-mono">
            Slot: {slotId} | Format: {format}
          </span>
        </div>
      ) : (
        <div className="overflow-hidden min-h-[100px] w-full max-w-[728px] flex justify-center">
          {/* 
            TODO: Once AdSense is approved, uncomment this block and add your Publisher ID
            
            <ins 
              className="adsbygoogle"
              style={{ display: "block", width: "100%" }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" 
              data-ad-slot={slotId}
              data-ad-format={format}
              data-full-width-responsive={responsive}
            />
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          */}
          <div className="bg-[var(--card)] border border-[var(--border)] border-dashed rounded-xl flex flex-col items-center justify-center w-full min-h-[120px] max-w-[728px] p-4 text-center opacity-70">
            <span className="text-[10px] uppercase tracking-wider text-[var(--muted-light)] mb-1 font-semibold">
              Advertisement Placeholder
            </span>
            <span className="text-xs text-[var(--muted)] font-mono">
              Pending AdSense Approval
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
