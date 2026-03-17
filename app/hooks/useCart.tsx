"use client";

import { useEffect, useState } from "react";

export function useCart() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function read() {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
        setCount(Array.isArray(cart) ? cart.length : 0);
      } catch {
        setCount(0);
      }
    }

    read();
    window.addEventListener("cart-updated", read);
    return () => window.removeEventListener("cart-updated", read);
  }, []);

  return { count };
}
