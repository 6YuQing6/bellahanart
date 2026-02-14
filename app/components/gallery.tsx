// app/gallery/page.tsx
import cloudinary from "@/lib/cloudinary";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import ImageCarousel from "./imagecarousel";

export default async function GalleryImages() {
  const { images, nextCursor } = await getImages();

  return (
    <div className="max-w-6xl mx-auto mt-4">
      <ImageCarousel images={images} />
    </div>
  );
}

async function getImages() {
  const results = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/by_asset_folder?asset_folder=gallery&max_results=100`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(process.env.CLOUDINARY_API_KEY + ":" + process.env.CLOUDINARY_API_SECRET).toString("base64")}`,
      },
    },
  ).then((r) => r.json());
  const { resources, next_cursor: nextCursor } = results;

  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  const images = resources
    .sort((a, b) =>
      collator.compare(a.display_name ?? "", b.display_name ?? ""),
    )
    .map((resource) => {
      const { width, height } = resource;
      return {
        id: resource.asset_id,
        title: resource.display_name,
        image: resource.secure_url,
        width,
        height,
      };
    });
  return { images, nextCursor };
}
