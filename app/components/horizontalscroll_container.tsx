"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  Children,
} from "react";

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let rafId: number;
    let paused = false;
    const speed = 2;

    const tick = () => {
      if (!paused) {
        const max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += speed;
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

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
        <FastScrollProgress
          scrollContainerRef={scrollRef}
          count={Children.count(children)}
          className="py-1"
        />
      )}
    </div>
  );
}

interface FastScrollProgressProps {
  scrollContainerRef: React.RefObject<HTMLElement>;
  /** Number of items in the scroll container */
  count: number;
  className?: string;
}

export function FastScrollProgress({
  scrollContainerRef,
  count,
  className = "",
}: FastScrollProgressProps) {
  const dotsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(-1);

  useEffect(() => {
    const el = scrollContainerRef.current;
    const dotContainer = dotsRef.current;
    if (!el || !dotContainer) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const max = el.scrollWidth - el.clientWidth;
        const p = max > 0 ? el.scrollLeft / max : 0;

        const step = Math.round(p * (count - 1));
        if (step === lastStepRef.current) return;
        lastStepRef.current = step;

        // toggle active class directly on each dot — no re-render
        const dots = dotContainer.children;
        for (let i = 0; i < dots.length; i++) {
          dots[i].classList.toggle("active", i === step);
        }
      });
    };

    // set first dot active on mount
    const firstDot = dotContainer.children[0];
    if (firstDot) firstDot.classList.add("active");

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollContainerRef, count]);

  return (
    <div
      ref={dotsRef}
      className={`flex items-center justify-center gap-1.5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`
            rounded-full
            bg-[var(--si-track,rgba(100,116,139,0.3))]
            transition-all duration-150 ease-out
            h-1.5 w-1.5
            [&.active]:bg-[var(--si-fill,rgba(155,74,71,0.9))]
            [&.active]:scale-125
          `}
        />
      ))}
    </div>
  );
}
