"use client";

import Link from "next/link";
import { useCart } from "../hooks/useCart"; // swap with your actual cart state

export default function CartIcon() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label="View your cart"
      title="View Cart"
      rel="nofollow"
      className="inline-flex items-center relative">
      <div className="relative">
        <svg
          width="21"
          height="24"
          viewBox="0 0 21 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.27 24a2.13 2.13 0 0 1-1.502-.58c-.417-.388-.625-.853-.625-1.396V7.028c0-.543.208-1.008.625-1.395a2.13 2.13 0 0 1 1.502-.58h3.138v-.47c0-1.277.48-2.36 1.436-3.25C7.802.446 8.968 0 10.343 0s2.541.445 3.498 1.334c.958.889 1.436 1.972 1.436 3.249v.47h3.139a2.13 2.13 0 0 1 1.502.58c.416.387.625.852.625 1.395v14.996c0 .543-.209 1.008-.625 1.395a2.13 2.13 0 0 1-1.502.581H2.27zm0-1.587h16.146c.104 0 .2-.04.287-.122a.36.36 0 0 0 .131-.267V7.028a.36.36 0 0 0-.13-.267.414.414 0 0 0-.288-.121h-3.139v2.996a.74.74 0 0 1-.246.565.867.867 0 0 1-.612.228.853.853 0 0 1-.608-.228.745.745 0 0 1-.242-.565V6.64H7.117v2.996a.74.74 0 0 1-.246.565.867.867 0 0 1-.612.228.853.853 0 0 1-.608-.228.745.745 0 0 1-.243-.565V6.64H2.27c-.105 0-.2.04-.288.121a.36.36 0 0 0-.13.267v14.996a.36.36 0 0 0 .13.267.414.414 0 0 0 .288.122zm4.847-17.36h6.452v-.47c0-.84-.312-1.55-.935-2.128-.622-.579-1.386-.868-2.291-.868s-1.669.29-2.292.868c-.622.578-.934 1.288-.934 2.128v.47z"
            fill="#1E1E1E"
          />
        </svg>

        {count > 0 && (
          <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-0.5 bg-[#1E1E1E] text-white text-[10px] font-medium leading-4 text-center rounded-full">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </div>
    </Link>
  );
}
