"use client";

import { useRouter } from "next/navigation";

export default function PaginationControls({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  const router = useRouter();

  function goTo(p: number) {
    router.push(`?page=${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-12">
      <button
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 text-sm text-[#333] border border-[#333] hover:bg-[#333] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        ← Prev
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`w-9 h-9 text-sm transition-colors ${
              p === page
                ? "bg-[#333] text-white"
                : "text-[#333] hover:bg-[#f0f0f0]"
            }`}>
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => goTo(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 text-sm text-[#333] border border-[#333] hover:bg-[#333] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
        Next →
      </button>
    </div>
  );
}
