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

  const progress = internalProgress;
  // #2: Add this ref at the top of the component, near your other refs
  const rafRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // ↓ your existing scroll effect — modified:
  useEffect(() => {
    const el = scrollContainerRef?.current;
    if (!el) return;

    const onScroll = () => {
      // #1: bail if a frame is already queued
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const max = el.scrollWidth - el.clientWidth;
        if (max <= 0) return;
        const p = el.scrollLeft / max;
        setInternalProgress(p);
        // #2: call via ref instead of directly
        onChangeRef.current?.(p);
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      // #1: cancel any pending frame on cleanup
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // #2: onChange is no longer in the dep array — the ref handles it
  }, [scrollContainerRef]);

  /* ── button handlers ────────────────────────────────────────── */
  const nudge = (dir: "left" | "right") => {
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

  return (
    <div className={`flex items-center h-8 gap-2 px-3 ${className}`}>
      {/* left button */}
      <ArrowButton
        dir="left"
        disabled={progress <= 0}
        onClick={() => nudge("left")}
      />

      {/* progress track */}
      <div className="relative h-[3px] flex-1 min-w-[72px] rounded-full overflow-hidden bg-[var(--si-track,rgba(100,116,139,0.18))]">
        <div
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ transform: `scaleX(${progress})`, willChange: "transform" }}
          className="absolute inset-y-0 left-0 right-0 rounded-full origin-left
               bg-[var(--si-fill,rgba(155,74,71,0.9))]
               transition-transform duration-300 ease-out" // ← was: transition-[width]
        />
      </div>

      {/* right button */}
      <ArrowButton
        dir="right"
        disabled={progress >= 1}
        onClick={() => nudge("right")}
      />
    </div>
  );
}

/* ── Arrow Button ───────────────────────────────────────────── */
interface ArrowButtonProps {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}

function ArrowButton({ dir, disabled, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className={`
        group relative flex h-7 w-7 items-center justify-center rounded-full cursor-pointer
        bg-[var(--si-btn-bg,rgba(255,255,255,0.06))]
        text-[var(--si-fg,#64748b)]
        backdrop-blur-sm
        transition-all duration-200
        hover:border-[var(--si-fill,#000000)] hover:text-[var(--si-fill,#000000)]
        disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:border-[var(--si-border,rgba(100,116,139,0.22))]
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
