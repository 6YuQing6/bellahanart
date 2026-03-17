import ImageCarousel from "../components/imagecarousel";

export default async function Page() {
  const { images } = await getImages();

  return (
    <section>
      <div className="max-w-6xl mx-auto mt-4">
        <ImageCarousel images={images} />
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
    .sort((a, b) =>
      collator.compare(a.display_name ?? "", b.display_name ?? ""),
    )
    .map((resource) => ({
      id: resource.asset_id,
      title: resource.display_name,
      image: resource.secure_url,
      width: resource.width,
      height: resource.height,
    }));

  return { images };
}
