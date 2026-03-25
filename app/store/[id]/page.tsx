import { ImageItem } from "../../components/types/image";
import Image from "next/image";
import AddToCartButton from "../../components/button_addtocart";
import { notFound } from "next/navigation";
import ImageMagnifier from "@/app/components/image_magnify";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const image = await getImage(id);

  if (!image) notFound();

  return (
    <section>
      <div className="max-w-6xl mx-auto mt-8 px-4 flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <ImageMagnifier
            src={image.imageUrl}
            alt={image.description}
            width={image.imageWidth}
            height={image.imageHeight}
            lensSize={200}
            zoom={1.5}
          />
        </div>
        <div className="flex flex-col gap-4 md:w-72">
          <div>
            <h1 className="text-2xl font-medium">{image.name}</h1>
            {image.cn_title && (
              <p className="text-lg text-gray-400 mt-0.5">{image.cn_title}</p>
            )}
          </div>
          <p className="text-gray-500 text-sm">{image.description}</p>
          <div className="text-sm text-gray-500 flex flex-col gap-1">
            {(image.dimensions_width > 0 || image.dimensions_height > 0) && (
              <p>
                {image.dimensions_width} × {image.dimensions_height} in
              </p>
            )}
            {image.year_created && <p>{image.year_created}</p>}
          </div>
          {/* Price + Cart */}
          <div className="flex items-center justify-between mt-1">
            <h6 className="text-lg font-medium text-[#333] opacity-100">
              ${image.price.toLocaleString()}
            </h6>
            <AddToCartButton {...image} />
          </div>
        </div>
      </div>
    </section>
  );
}

async function getImage(id: string): Promise<ImageItem | null> {
  const result = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/${id}?context=true`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          process.env.CLOUDINARY_API_KEY +
            ":" +
            process.env.CLOUDINARY_API_SECRET,
        ).toString("base64")}`,
      },
      next: { revalidate: 3600 },
    },
  ).then((r) => r.json());

  if (!result) return null;

  return {
    id: result.asset_id,
    name: result.context?.custom?.caption ?? "Untitled",
    description:
      result.context?.custom?.alt ?? "Chinese Paint & Ink On Rice Paper",
    imageUrl: result.secure_url,
    imageWidth: result.width,
    imageHeight: result.height,
    price: Number(result.context?.custom?.price) ?? 0,
    href: `/store/${result.asset_id}`,
    cn_title: result.context?.custom?.cn_title ?? "无题",
    dimensions_height: result.context?.custom?.dimensions_height ?? 0,
    dimensions_width: result.context?.custom?.dimensions_width ?? 0,
    year_created: result.context?.custom?.year_created ?? 2025,
  };
}
