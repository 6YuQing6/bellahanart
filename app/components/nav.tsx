import Link from "next/link";
import CartIcon from "./button_cart";

const navItems = {
  "/": {
    name: "about",
  },
  "/gallery": {
    name: "gallery",
  },
  "/store": {
    name: "store",
  },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px] tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-center justify-between relative px-0 pb-0"
          id="nav">
          <div className="flex flex-row items-center">
            <h1 className="font-semibold tracking-tight flex align-middle relative py-1 px-2 m-1">
              BellaHanArt
            </h1>
            <span className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 m-2" />
            {Object.entries(navItems).map(([path, { name }]) => (
              <Link
                key={path}
                href={path}
                className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1">
                {name}
              </Link>
            ))}
          </div>

          <div className="w-8 flex justify-center">
            <CartIcon />
          </div>
        </nav>
      </div>
    </aside>
  );
}
