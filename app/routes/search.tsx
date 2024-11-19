import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams, useSubmit } from "@remix-run/react";
import { useState, useEffect } from "react";
import dataFetcher from "~/libs/dataFetcher.server";
import { AnimeLink } from "~/interfaces/interfaces";
import CardList from "~/components/CardList";
import { MetaFunction } from "@remix-run/react";
import Pagination from "~/components/Pagination";

export const meta: MetaFunction = () => {
  return [
    { title: "Search | AnimeX" },
    { name: "description", content: "unofficial anime streamig website!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const page = url.searchParams.get("page") || "1";

  if (!query) {
    return {
      animeLinks: [],
      pagination: { links: [], currentPage: 1, totalPages: 1 },
    };
  }

  const fetcher = new dataFetcher();
  const searchResults = await fetcher.searchAnime(query, page);

  return searchResults;
};

export default function SearchResults() {
  const { animeLinks, pagination } = useLoaderData<{
    animeLinks: AnimeLink[];
    pagination: {
      links: any[];
      currentPage: number;
      totalPages: number;
    };
  }>();

  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const submit = useSubmit();

  const handlePageChange = (page: number) => {
    setLoading(true);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    submit(newSearchParams, { replace: true });
  };

  useEffect(() => {
    setLoading(false);
  }, [animeLinks]);

  return (
    <div className="pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Search Results for "{query}"
          </h1>
          <p className="mt-2 text-white">Found {animeLinks.length} results</p>
        </div>

        {animeLinks.length > 0 ? (
          <>
            <CardList data={animeLinks} loading={loading} />
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              links={pagination.links}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No results found for "{query}". Try searching with different
              keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
