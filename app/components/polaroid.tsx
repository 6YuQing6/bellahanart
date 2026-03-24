// PolaroidGrid.jsx
export function PolaroidGrid({ children }) {
  return (
    <ul
      className="
        w-full
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-x-12
        gap-y-12
        justify-between
        m-0 p-0
        border-0
        box-border
        antialiased
        text-[#333333]
        list-none
      ">
      {children}
    </ul>
  );
}

import Link from "next/link";
import AddToCartButton from "./button_addtocart";
import { ImageItem } from "./types/image";

// PolaroidCard.jsx
export function PolaroidCard(item: ImageItem) {
  const paddingTop = `calc(${((item.imageHeight / item.imageWidth) * 100).toFixed(3)}% + 8px)`;

  return (
    <figure className="m-0 p-0 border-0 box-border">
      <Link
        tabIndex={0}
        href={item.href}
        aria-label={item.name}
        title={`${item.name} Painting`}
        className="relative block w-full overflow-hidden"
        style={{ paddingTop }}>
        <img
          src={item.imageUrl}
          alt={item.description}
          width={item.imageWidth}
          height={item.imageHeight}
          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
        />
      </Link>

      {/* Price + Cart */}
      <div className="flex items-center justify-between mt-1">
        <h6 className="text-md font-small text-[#333] opacity-70">
          ${item.price.toLocaleString()}
        </h6>
        <AddToCartButton
          id={item.id}
          name={item.name}
          price={item.price}
          imageUrl={item.imageUrl}
          href={item.href}
        />
      </div>

      {/* Name + Description */}
      <div className="mt-0.5">
        <h6 className="text-lg font-medium text-[#333] leading-snug">
          <Link
            tabIndex={0}
            href={item.href}
            aria-label={`View ${item.name} Painting`}
            title={`View ${item.name} Painting`}
            rel="nofollow"
            className="hover:underline">
            {item.name}
          </Link>
        </h6>
        {item.description && (
          <p className="text-xs text-[#333] opacity-70 mt-1 leading-snug">
            {item.description}
          </p>
        )}
        <p className="text-xs text-[#333] opacity-50 mt-0.5 leading-snug">
          {item.dimensions_width} × {item.dimensions_height} in ·{" "}
          {item.year_created}
        </p>
      </div>
    </figure>
  );
}
