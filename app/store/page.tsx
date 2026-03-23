import { PolaroidGrid, PolaroidCard } from "../components/polaroid";
import PaginationControls from "../components/paginationcontrols";

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
      <div className="max-w-6xl mx-auto mt-4 px-4">
        <PolaroidGrid>
          {images.map((image) => (
            <PolaroidCard
              key={image.id}
              id={image.id}
              name={image.title}
              price={image.price}
              href={image.image}
              description={image.description}
              imageUrl={image.image}
              imageWidth={image.width}
              imageHeight={image.height}
            />
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
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/by_asset_folder?asset_folder=store&max_results=500`,
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
    .sort((a, b) =>
      collator.compare(a.display_name ?? "", b.display_name ?? ""),
    )
    .map((resource) => ({
      id: resource.asset_id,
      title: resource.display_name ?? "Untitled",
      description: resource.context?.custom?.description ?? null,
      image: resource.secure_url,
      width: resource.width,
      height: resource.height,
      price: Number(resource.context?.custom?.price) ?? 0,
    }));

  const start = (page - 1) * PAGE_SIZE;
  const images = sorted.slice(start, start + PAGE_SIZE);

  return { images, total: sorted.length };
}
