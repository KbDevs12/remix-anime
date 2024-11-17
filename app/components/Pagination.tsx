import { PaginationProps } from "~/interfaces/interfaces";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  links,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 rounded-lg bg-violet-700 text-white hover:bg-violet-800 transition-colors"
        >
          Prev
        </button>
      )}

      {links.map((link) => (
        <button
          key={link.page}
          onClick={() => onPageChange(link.page)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentPage === link.page
              ? "bg-violet-900 text-white scale-105"
              : "bg-violet-700 text-white hover:bg-violet-800"
          }`}
        >
          {link.text}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 rounded-lg bg-violet-700 text-white hover:bg-violet-800 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
}
