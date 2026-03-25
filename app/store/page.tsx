import { PolaroidGrid, PolaroidCard } from "../components/polaroid";
import PaginationControls from "../components/paginationcontrols";
import { ImageItem } from "../components/types/image";

const PAGE_SIZE = 30;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedParams.page ?? "1", 10));
  const { images, total } = await getImages(page);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <section>
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <h1 className="text-lg font-semibold text-[#333] mb-6">
          Original Works ({total})
        </h1>
        <PolaroidGrid>
          {images.map((image: ImageItem) => (
            <PolaroidCard key={image.id} {...image} />
          ))}
        </PolaroidGrid>
        <PaginationControls page={page} totalPages={totalPages} />
      </div>
    </section>
  );
}

// https://youtu.be/XJWdLbw3QjY?si=ErnV2oDDf1aiw5ZB
async function getImages(page: number) {
  const results = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/by_asset_folder?asset_folder=store&max_results=500&context=true`,
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

  const { resources } = results;

  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  const sorted = resources
    .filter((i) => {
      return i.metadata?.public == "true";
    })
    .map(
      (resource): ImageItem => ({
        id: resource.asset_id,
        name: resource.context?.custom?.caption ?? "Untitled",
        description:
          resource.context?.custom?.alt ?? "Chinese Paint & Ink On Rice Paper",
        imageUrl: resource.secure_url,
        imageWidth: resource.width,
        imageHeight: resource.height,
        price: Number(resource.context?.custom?.price) ?? 0,
        href: `/store/${resource.asset_id}`,
        cn_title: resource.context?.custom?.cn_title ?? "无题",
        dimensions_height: resource.context?.custom?.dimensions_height ?? 0,
        dimensions_width: resource.context?.custom?.dimensions_width ?? 0,
        year_created: resource.context?.custom?.year_created ?? 2025,
      }),
    );

  const start = (page - 1) * PAGE_SIZE;
  const images = sorted.slice(start, start + PAGE_SIZE);

  return { images, total: sorted.length };
}
