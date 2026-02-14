import Link from "next/link";

const navItems = {
  "/": {
    name: "about",
  },
  "/blog": {
    name: "gallery",
  },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px]  tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav">
          <div className="flex flex-row items-center pr-10">
            <h1 className="font-semibold tracking-tight flex align-middle relative py-1 px-2 m-1">
              BellaHanArt
            </h1>
            <span className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 m-2" />
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1">
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
