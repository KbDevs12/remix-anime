import { Link } from "@remix-run/react";
import { HeadCompsProps } from "~/interfaces/interfaces";

export default function HeaderComps({ title, link }: HeadCompsProps) {
  return (
    <div className="flex flex-row items-start justify-between w-full py-4 px-8 bg-gradient-to-r from-violet-700 to-violet-900 shadow-md">
      <h1 className="font-semibold text-lg text-white cursor-pointer hover:text-violet-300">
        {title}
      </h1>
      {link && (
        <Link
          className="text-white hover:text-violet-300 hover:-translate-y-1 transition-all duration-300"
          to={link}
        >
          Lihat selengkapnya...
        </Link>
      )}
    </div>
  );
}
