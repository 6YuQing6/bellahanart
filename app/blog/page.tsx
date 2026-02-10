import { BlogPosts } from "app/components/posts";
import GalleryImages from "../components/gallery";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Gallery Pieces
      </h1>
      <GalleryImages />
    </section>
  );
}
