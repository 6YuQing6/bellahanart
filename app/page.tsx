"use client";
import { BlogPosts } from "app/components/posts";
import { CldImage } from "next-cloudinary";

export default function Page() {
  return (
    <section>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* LEFT: Photo (1 part) */}
        <div className="flex-[1] max-w-sm">
          <CldImage
            src="image1_nnbfjy"
            alt="profile-photo"
            width="800"
            height="800"
            className="rounded-lg w-full h-auto"
            crop={{
              type: "auto",
              source: true,
            }}
          />
        </div>

        {/* RIGHT: Text (2 parts) */}
        <div className="flex-[2]">
          <h1 className="mb-4 text-2xl font-semibold tracking-tighter">
            Artist Biography
          </h1>

          <p className="mb-4">
            Bella Han, born in 1975, graduated from the Department of Industrial
            Design at Shanghai Jiao Tong University and later pursued advanced
            studies in China Academy of Art, HangZhou. Introduced to art at an
            early age, she has practiced drawing and painting since childhood
            and received systematic training in both Western and Eastern art
            traditions.
          </p>

          <p className="mb-4">
            Her work is rooted in the Chinese XieYi (freehand) flower-and-bird
            tradition, emphasizing “capturing spirit through form” and
            prioritizing mood and artistic conception over literal realism.
          </p>
        </div>
      </div>
    </section>
  );
}
