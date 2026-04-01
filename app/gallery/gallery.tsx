// components/GalleryScroller.tsx
"use client";
import { useWindowSize } from "../hooks/useWindowSize";
import HorizontalScrollContainer from "../components/horizontalscroll_container";
import GalleryCard from "../components/gallerycard";
import { ImageItem } from "../components/types/image";
import ImageCarousel from "../components/imagecarousel";

export default function GalleryScroller({ images }: { images: ImageItem[] }) {
  const { isSmall, height } = useWindowSize();
  if (height === null) return null; // or a skeleton/loading state

  return isSmall ? (
    <ImageCarousel images={images} />
  ) : (
    <HorizontalScrollContainer gap="gap-6" padding="px-2" fadeEdges>
      {images.map((img: ImageItem) => (
        <GalleryCard key={img.id} image={img} cardHeight={height * 0.75} />
      ))}
    </HorizontalScrollContainer>
  );
}
