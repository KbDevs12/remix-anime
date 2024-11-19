import { LoaderFunction } from "@remix-run/node";
import { MetaFunction, useLoaderData, useSearchParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import CardList from "~/components/CardList";
import Pagination from "~/components/Pagination";
import { AnimeLink, PaginationLink } from "~/interfaces/interfaces";
import dataFetcher, { baseUrl } from "~/libs/dataFetcher.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Anime | AnimeX" },
    { name: "description", content: "unofficial anime streamig website!" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const fetcher = new dataFetcher();

  const { animeLinks, pagination } = await fetcher.animePage(
    page === "1" ? undefined : `${baseUrl}/category/anime/page/${page}`
  );

  return { animeLinks, pagination };
};

export default function Page() {
  const { animeLinks, pagination } = useLoaderData<{
    animeLinks: AnimeLink[];
    pagination: {
      links: PaginationLink[];
      currentPage: number;
      totalPages: number;
    };
  }>();

  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (animeLinks.length > 0) {
      setLoading(false);
    }
  }, [animeLinks]);

  const handlePageChange = (page: number) => {
    setLoading(true);
    setSearchParams({ page: page.toString() });
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center p-4">
        <div className="w-full my-4">
          <CardList data={animeLinks} loading={loading} />
          {!loading && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              links={pagination.links}
            />
          )}
        </div>
      </main>
    </>
  );
}
