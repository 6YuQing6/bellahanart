"use client";
import { useRef } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  href: string;
};

export default function AddToCartButton(item: CartItem) {
  function handleAddToCart() {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") ?? "[]");
    if (!cart.some((i) => i.id === item.id)) {
      cart.push(item);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      title="Add to Cart"
      className="group p-1 transition-opacity cursor-pointer">
      {/* Outline — visible by default, hidden on hover */}
      <svg
        className="block group-hover:hidden"
        width="22"
        height="28"
        viewBox="0 0 22 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.273 28c-.637 0-1.175-.22-1.614-.659A2.196 2.196 0 0 1 0 25.727V8.496C0 7.858.22 7.32.659 6.88c.439-.44.977-.659 1.614-.659h3.291v-.897c0-1.487.516-2.746 1.548-3.778C8.143.516 9.402 0 10.889 0c1.486 0 2.745.516 3.777 1.547 1.032 1.032 1.548 2.291 1.548 3.778v.897h3.29c.638 0 1.176.22 1.615.659.44.44.659.977.659 1.615v17.23c0 .638-.22 1.176-.659 1.615-.44.44-.977.659-1.615.659H2.274zm0-1.316h17.231c.24 0 .459-.1.658-.3.2-.199.3-.418.3-.657V8.496c0-.24-.1-.459-.3-.658-.199-.2-.418-.3-.658-.3h-3.29v4.009a.645.645 0 0 1-.663.658.629.629 0 0 1-.469-.188.645.645 0 0 1-.184-.47V7.539H6.88v4.008a.644.644 0 0 1-.663.658.629.629 0 0 1-.468-.188.645.645 0 0 1-.185-.47V7.539h-3.29c-.24 0-.46.1-.659.299-.199.199-.299.418-.299.658v17.23c0 .24.1.46.3.659.199.199.418.299.657.299zM6.88 6.222h8.018v-.897c0-1.128-.387-2.078-1.159-2.85-.772-.773-1.722-1.159-2.85-1.159-1.128 0-2.078.386-2.85 1.158-.773.773-1.159 1.723-1.159 2.85v.898z"
          fill="#000"
        />
      </svg>

      {/* Filled — hidden by default, visible on hover */}
      <svg
        className="hidden group-hover:block transition duration-150 ease-in-out active:scale-60"
        width="22"
        height="28"
        viewBox="0 0 22 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2.273 28c-.637 0-1.175-.22-1.614-.659A2.196 2.196 0 0 1 0 25.727V8.496C0 7.858.22 7.32.659 6.88c.439-.44.977-.659 1.614-.659h3.291v-.897c0-1.487.516-2.746 1.548-3.778C8.143.516 9.402 0 10.889 0c1.486 0 2.745.516 3.777 1.547 1.032 1.032 1.548 2.291 1.548 3.778v.897h3.29c.638 0 1.176.22 1.615.659.44.44.659.977.659 1.615v17.23c0 .638-.22 1.176-.659 1.615-.44.44-.977.659-1.615.659H2.274zm0-1.316h17.231c.24 0 .459-.1.658-.3.2-.199.3-.418.3-.657V8.496c0-.24-.1-.459-.3-.658-.199-.2-.418-.3-.658-.3h-3.29v4.009a.645.645 0 0 1-.663.658.629.629 0 0 1-.469-.188.645.645 0 0 1-.184-.47V7.539H6.88v4.008a.644.644 0 0 1-.663.658.629.629 0 0 1-.468-.188.645.645 0 0 1-.185-.47V7.539h-3.29c-.24 0-.46.1-.659.299-.199.199-.299.418-.299.658v17.23c0 .24.1.46.3.659.199.199.418.299.657.299zM6.88 6.222h8.018v-.897c0-1.128-.387-2.078-1.159-2.85-.772-.773-1.722-1.159-2.85-1.159-1.128 0-2.078.386-2.85 1.158-.773.773-1.159 1.723-1.159 2.85v.898z"
          fill="#000"
        />
        <rect x="1" y="7" width="20" height="20" rx="2" fill="#1E1E1E" />
      </svg>
      {/*       
      {count > 0 && (
        <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-0.5 bg-[#1E1E1E] text-white text-[10px] font-medium leading-4 text-center rounded-full">
          {count > 99 ? "99+" : count}
        </span>
      )} */}
    </button>
  );
}
