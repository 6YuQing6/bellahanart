"use client";
import { useRef, useState, MouseEvent, TouchEvent } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  zoom?: number;
  lensSize?: number;
};

export default function ImageMagnifier({
  src,
  alt,
  width,
  height,
  zoom = 2.5,
  lensSize = 150,
}: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [lens, setLens] = useState<{ x: number; y: number } | null>(null);

  function getPosition(clientX: number, clientY: number) {
    const img = imgRef.current;
    if (!img) return null;
    const { left, top, width: w, height: h } = img.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    if (x < 0 || y < 0 || x > w || y > h) return null;
    return { x, y };
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    setLens(getPosition(e.clientX, e.clientY));
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    e.preventDefault();
    const touch = e.touches[0];
    setLens(getPosition(touch.clientX, touch.clientY));
  }

  const bgX = lens ? -(lens.x * zoom - lensSize / 2) : 0;
  const bgY = lens ? -(lens.y * zoom - lensSize / 2) : 0;

  return (
    <div
      className="relative w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLens(null)}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setLens(null)}
      onTouchCancel={() => setLens(null)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto object-contain select-none"
        draggable={false}
      />
      {lens && (
        <div
          className="absolute pointer-events-none rounded-full border-2 border-white shadow-xl overflow-hidden"
          style={{
            width: lensSize,
            height: lensSize,
            top: lens.y - lensSize / 2,
            left: lens.x - lensSize / 2,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgRef.current!.getBoundingClientRect().width * zoom}px ${imgRef.current!.getBoundingClientRect().height * zoom}px`,
            backgroundPosition: `${bgX}px ${bgY}px`,
          }}
        />
      )}
    </div>
  );
}
