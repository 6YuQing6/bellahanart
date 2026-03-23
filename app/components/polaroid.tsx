// PolaroidGrid.jsx
export function PolaroidGrid({ children }) {
  return (
    <ul
      className="
        w-full
        grid
        grid-cols-1
        sm:grid-cols-3
        gap-x-6
        gap-y-6
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

import AddToCartButton from "./button_addtocart";

// PolaroidCard.jsx
export function PolaroidCard({
  id,
  name,
  price,
  href,
  description,
  imageUrl,
  imageWidth,
  imageHeight,
}) {
  const paddingTop = `calc(${((imageHeight / imageWidth) * 100).toFixed(3)}% + 8px)`;

  return (
    <figure className="m-0 p-0 border-0 box-border">
      <a
        tabIndex={0}
        href={href}
        aria-label={name}
        title={`${name} Painting`}
        target="_blank"
        className="relative block w-full overflow-hidden"
        style={{ paddingTop }}>
        <img
          src={imageUrl}
          alt={description}
          width={imageWidth}
          height={imageHeight}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </a>

      {/* Price + Cart */}
      <div className="flex items-center justify-between mt-2">
        <h6 className="text-sm font-medium text-[#333] opacity-70">
          ${(price / 100).toLocaleString()}
        </h6>
        <AddToCartButton
          id={id}
          name={name}
          price={0}
          imageUrl={imageUrl}
          href={href}
        />
      </div>

      {/* Name + Description */}
      <div className="mt-1">
        <h6 className="text-sm font-medium text-[#333] leading-snug">
          <a
            tabIndex={0}
            href={href}
            aria-label={`View ${name} Painting`}
            title={`View ${name} Painting`}
            rel="nofollow"
            target="_blank"
            className="hover:underline">
            {name}
          </a>
        </h6>
        {description && (
          <p className="text-xs text-[#333] opacity-70 mt-0.5 leading-snug">
            {description}
          </p>
        )}
      </div>
    </figure>
  );
}
