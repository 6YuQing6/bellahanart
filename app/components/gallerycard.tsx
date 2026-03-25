"use client";

import { ImageItem } from "./types/image";

interface GalleryCardProps {
  image: ImageItem;
  /** Fixed card height in px — width scales from aspect ratio */
  cardHeight?: number;
}

export default function GalleryCard({
  image,
  cardHeight = 400,
}: GalleryCardProps) {
  const aspectRatio = (image.imageWidth || 1) / (image.imageHeight || 1);
  const cardWidth = Math.round(cardHeight * aspectRatio);

  return (
    <div
      className="group relative flex-shrink-0 overflow-hidden bg-neutral-100 flex-none"
      style={{ width: cardWidth, height: "100%" }}>
      {/* image */}
      <img
        src={image.imageUrl}
        alt={image.name}
        width={image.imageWidth}
        height={image.imageHeight}
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />

      {/* overlay */}
      <div
        className="
          absolute inset-0 flex flex-col justify-center
          bg-white/65
          opacity-0 transition-opacity duration-300 ease-out
          group-hover:opacity-100
          backdrop-blur-[1px]
          text-center
        ">
        <div className="p-3">
          <p className="text-md font-bold leading-tight text-neutral-900">
            {image.name}
          </p>
          {image.price !== undefined && (
            <p className="mt-0.5 text-sm font-semibold text-neutral-800">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(image.price)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
