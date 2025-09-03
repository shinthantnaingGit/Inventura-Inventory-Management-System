"use client";
export default function InventuraMark({ className = "size-7" }) {
  // Simple geometric "I" inside a rounded square
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="inv-grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#inv-grad)" />
      <rect x="14" y="8" width="4" height="16" rx="2" fill="white" />
    </svg>
  );
}
