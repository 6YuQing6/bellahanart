"use client";

import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import ScrollIndicator from "./scroll_indicator";

interface HorizontalScrollContainerProps {
  children: ReactNode;
  /** Show the scroll indicator bar below the container */
  showIndicator?: boolean;
  /** Gap between children (Tailwind gap class, e.g. "gap-3") */
  gap?: string;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Extra classes on the scroll track */
  trackClassName?: string;
  /** Padding inside the scroll track (Tailwind px class, e.g. "px-4") */
  padding?: string;
  /** Fade edges when content overflows */
  fadeEdges?: boolean;
}

export default function HorizontalScrollContainer({
  children,
  showIndicator = true,
  gap = "gap-4",
  className = "",
  trackClassName = "",
  padding = "px-4",
  fadeEdges = true,
}: HorizontalScrollContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    setProgress(p);
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < max - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateState();
    const ro = new ResizeObserver(updateState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateState]);

  const fadeLeft = fadeEdges && canScrollLeft;
  const fadeRight = fadeEdges && canScrollRight;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* scroll track wrapper — handles edge fades */}
      <div className="relative">
        {/* left fade */}
        {fadeLeft && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-4
                       bg-gradient-to-r from-white to-transparent
                       dark:from-neutral-900"
          />
        )}
        {/* right fade */}
        {fadeRight && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-4
                       bg-gradient-to-l from-white to-transparent
                       dark:from-neutral-900"
          />
        )}

        {/* actual scroll container */}
        <div
          ref={scrollRef}
          onScroll={updateState}
          className={`flex overflow-x-scroll scroll-smooth py-2
                      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
                      ${gap} ${padding} ${trackClassName}`}>
          {children}
        </div>
      </div>

      {/* indicator */}
      {showIndicator && (
        <ScrollIndicator
          value={progress}
          scrollContainerRef={scrollRef}
          onChange={setProgress}
          className="px-1"
        />
      )}
    </div>
  );
}
