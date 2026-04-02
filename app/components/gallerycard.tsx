"use client";

import { ImageItem } from "./types/image";
import Image from "next/image";

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
      <div
        className="group relative flex-shrink-0 overflow-hidden bg-neutral-100 flex-none"
        style={{ width: cardWidth, height: cardHeight }}>
        <Image
          src={image.imageUrl}
          alt={image.name}
          width={cardWidth}
          height={cardHeight}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* overlay */}
      {/* overlay — bottom 30% only */}
      <div
        className="
        absolute bottom-0 left-0 right-0 h-[35%]
        flex flex-col items-center justify-end
        bg-gradient-to-t from-white/80 to-transparent
        opacity-0 transition-opacity duration-300 ease-out
        group-hover:opacity-100
        text-center
      ">
        <div className="p-3 mb-4">
          <p className="text-md font-bold leading-tight text-neutral-900 drop-shadow-[0_2px_5px_rgba(255,255,255,1)]">
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
