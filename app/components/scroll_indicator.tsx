"use client";
import { useRef, useState, useEffect, useCallback } from "react";

interface ScrollIndicatorProps {
  /** 0–1 progress value (controlled mode) */
  value?: number;
  /** Container ref to auto-track scroll progress */
  scrollContainerRef?: React.RefObject<HTMLElement>;
  /** Step size when using arrow buttons (0–1 fraction) */
  step?: number;
  /** Called when progress changes via buttons */
  onChange?: (value: number) => void;
  className?: string;
}

export default function ScrollIndicator({
  value,
  scrollContainerRef,
  step = 0.15,
  onChange,
  className = "",
}: ScrollIndicatorProps) {
  const [internalProgress, setInternalProgress] = useState(value ?? 0);
  const [isAnimating, setIsAnimating] = useState<"left" | "right" | null>(null);

  const progress = internalProgress;

  /* ── auto-track scroll container ───────────────────────────── */
  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const p = el.scrollLeft / max;
      setInternalProgress(p);
      onChange?.(p);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollContainerRef, onChange]);

  /* ── button handlers ────────────────────────────────────────── */
  const nudge = (dir: "left" | "right") => {
    setIsAnimating(dir);
    setTimeout(() => setIsAnimating(null), 320);

    const next = Math.min(
      1,
      Math.max(0, progress + (dir === "right" ? step : -step)),
    );

    if (value === undefined) setInternalProgress(next);
    onChange?.(next);

    if (scrollContainerRef?.current) {
      const el = scrollContainerRef.current;
      const max = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: next * max, behavior: "smooth" });
    }
  };

  const pct = `${(progress * 100).toFixed(2)}%`;

  return (
    <div className={`flex items-center h-8 gap-2 px-3 ${className}`}>
      {/* hint label */}
      <span
        aria-live="polite"
        className={`
    mr-1 select-none whitespace-nowrap text-[10px] tracking-widest uppercase
    text-[var(--si-fg,#64748b)]
    transition-all duration-500 ease-out
    ${progress < 0.2 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"}
  `}>
        Scroll for more
      </span>

      {/* left button */}
      <ArrowButton
        dir="left"
        disabled={progress <= 0}
        active={isAnimating === "left"}
        onClick={() => nudge("left")}
      />

      {/* progress track */}
      <div className="relative h-[3px] flex-1 min-w-[72px] rounded-full overflow-hidden bg-[var(--si-track,rgba(100,116,139,0.18))]">
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: pct }}
          className="absolute inset-y-0 left-0 rounded-full bg-[var(--si-fill,#0ea5e9)] transition-[width] duration-300 ease-out"
        />
        {/* subtle shimmer */}
        <div
          style={{ width: pct }}
          className="absolute inset-y-0 left-0 rounded-full overflow-hidden">
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full" />
        </div>
      </div>

      {/* right button */}
      <ArrowButton
        dir="right"
        disabled={progress >= 1}
        active={isAnimating === "right"}
        onClick={() => nudge("right")}
      />
    </div>
  );
}

/* ── Arrow Button ───────────────────────────────────────────── */
interface ArrowButtonProps {
  dir: "left" | "right";
  disabled: boolean;
  active: boolean;
  onClick: () => void;
}

function ArrowButton({ dir, disabled, active, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className={`
        group relative flex h-7 w-7 items-center justify-center rounded-full
        border border-[var(--si-border,rgba(100,116,139,0.22))]
        bg-[var(--si-btn-bg,rgba(255,255,255,0.06))]
        text-[var(--si-fg,#64748b)]
        backdrop-blur-sm
        transition-all duration-200
        hover:border-[var(--si-fill,#0ea5e9)] hover:text-[var(--si-fill,#0ea5e9)]
        hover:bg-[var(--si-btn-hover,rgba(14,165,233,0.08))]
        disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-[var(--si-border,rgba(100,116,139,0.22))]
        disabled:hover:text-[var(--si-fg,#64748b)] disabled:hover:bg-transparent
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--si-fill,#0ea5e9)]
        ${active ? "translate-y-[1px]" : "translate-y-0"} transform-gpu
      `}>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden="true">
        {dir === "left" ? (
          <polyline points="10 3 5 8 10 13" />
        ) : (
          <polyline points="6 3 11 8 6 13" />
        )}
      </svg>
    </button>
  );
}
