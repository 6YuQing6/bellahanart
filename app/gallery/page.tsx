import GalleryCard from "../components/gallerycard";
import HorizontalScrollContainer from "../components/horizontalscroll_container";
import { ImageItem } from "../components/types/image";

export default async function Page() {
  const { images } = await getImages();

  return (
    <section>
      <div className="max-w-6xl mx-auto mt-4">
        <HorizontalScrollContainer gap="gap-6" padding="px-2" fadeEdges>
          {images.map((img: ImageItem) => (
            <GalleryCard key={img.id} image={img} />
          ))}
        </HorizontalScrollContainer>
      </div>
    </section>
  );
}

async function getImages() {
  const results = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/by_asset_folder?asset_folder=gallery&max_results=100`,
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

  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });

  const images = results.resources
    .sort((a: any, b: any) =>
      collator.compare(a.display_name ?? "", b.display_name ?? ""),
    )
    .map(
      (resource: any): ImageItem => ({
        id: resource.asset_id,
        name: resource.display_name,
        price: resource.price,
        href: resource.secure_url,
        description: resource.context?.custom?.description ?? "",
        imageUrl: resource.secure_url,
        imageWidth: resource.width,
        imageHeight: resource.height,
        cn_title: resource.display_name,
        dimensions_height: resource.height,
        dimensions_width: resource.width,
        year_created: resource.context?.custom?.year_created ?? 0,
      }),
    );

  return { images };
}
