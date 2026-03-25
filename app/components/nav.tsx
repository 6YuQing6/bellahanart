"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import CartIcon from "./button_cart";

const navItems = {
  "/": {
    name: "about",
  },
  "/gallery": {
    name: "gallery",
  },
  "/store": {
    name: "store",
  },
};

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-5 h-4 flex flex-col justify-between">
      <span
        className={`block h-px bg-current transition-all duration-300 origin-center ${
          open ? "rotate-45 translate-y-[7.5px]" : ""
        }`}
      />
      <span
        className={`block h-px bg-current transition-all duration-300 ${
          open ? "opacity-0 scale-x-0" : ""
        }`}
      />
      <span
        className={`block h-px bg-current transition-all duration-300 origin-center ${
          open ? "-rotate-45 -translate-y-[7.5px]" : ""
        }`}
      />
    </div>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setVisible(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <aside
      className={`-ml-[8px] tracking-tight sticky top-0 z-40 transition-transform duration-300 bg-white/80 backdrop-blur-sm${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}>
      <div>
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0 py-2"
          id="nav">
          {/* Left: brand + desktop nav links */}
          <div className="flex flex-row items-center">
            <h1 className="font-semibold tracking-tight flex align-middle relative py-1 px-2 m-1">
              BellaHanArt
            </h1>

            {/* Desktop nav links */}
            <div className="hidden sm:flex flex-row items-center">
              <span className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 m-2" />
              {Object.entries(navItems).map(([path, { name }]) => (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1">
                  {name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: cart + hamburger (mobile only) */}
          <div className="flex items-center gap-2">
            <div className="w-8 flex justify-center">
              <CartIcon />
            </div>

            {/* Hamburger button — mobile only */}
            <button
              className="sm:hidden flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}>
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </nav>
      </div>

      {menuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu">
          {/* Close button pinned to top-right corner */}
          <button
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu">
            <HamburgerIcon open={true} />
          </button>

          {/* Nav links centered in the overlay */}
          <div className="flex flex-col items-start justify-center h-full px-8">
            <p className="text-sm tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 font-medium">
              BellaHanArt
            </p>
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-medium py-3 border-b border-neutral-100 dark:border-neutral-800 w-full hover:text-neutral-500 dark:hover:text-neutral-400 transition-colors">
                {name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
