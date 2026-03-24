"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  href: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function readCart() {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
        console.log(cart);
        setItems(Array.isArray(cart) ? cart : []);
        console.log(items);
      } catch {
        setItems([]);
      }
    }
    readCart();
    setMounted(true);
    window.addEventListener("cart-updated", readCart);
    return () => window.removeEventListener("cart-updated", readCart);
  }, []);

  function removeItem(id: string) {
    const updated = items.filter((i) => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setItems(updated);
    window.dispatchEvent(new Event("cart-updated"));
  }

  function clearCart() {
    localStorage.setItem("cart", "[]");
    setItems([]);
    window.dispatchEvent(new Event("cart-updated"));
  }

  const total = items.reduce((sum, i) => sum + i.price, 0);

  if (!mounted) return null;

  return (
    <section className="max-w-2xl mx-auto px-4 mt-8">
      <h1 className="text-lg font-semibold text-[#333] mb-6">
        Your Cart {items.length > 0 && `(${items.length})`}
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-[#333]">
          <p className="text-sm opacity-60">Your cart is empty.</p>
          <Link
            href="/store"
            className="text-sm underline underline-offset-4 hover:opacity-60 transition-opacity">
            Browse the store
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-neutral-200">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 py-4 min-w-xs">
                <Link href={item.href} className="shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover"
                  />
                </Link>

                <div className="flex-1">
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-[#333] hover:underline underline-offset-4 line-clamp-1">
                    {item.name}
                  </Link>
                  {item.price > 0 && (
                    <p className="text-sm text-[#333] opacity-60 mt-0.5">
                      ${item.price.toLocaleString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  title="Remove item"
                  className="text-xs text-[#333] opacity-40 hover:opacity-100 transition-opacity shrink-0 cursor-pointer">
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-6 border-t border-neutral-200 mt-2">
            <button
              onClick={clearCart}
              className="text-xs text-[#333] opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
              Clear cart
            </button>

            {total > 0 && (
              <p className="text-sm font-medium text-[#333]">
                Total: ${total.toLocaleString()}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
