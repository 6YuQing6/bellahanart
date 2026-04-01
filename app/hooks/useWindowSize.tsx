// hooks/useWindowSize.ts
"use client";
import { useEffect, useState } from "react";

export function useWindowSize() {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    update(); // set real values after hydration
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    width: size?.width ?? null,
    height: size?.height ?? null,
    isSmall: size ? size.width < 640 : false, // default to large on server
  };
}
