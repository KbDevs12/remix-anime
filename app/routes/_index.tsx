import { LoaderFunction } from "@vercel/remix";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/react";
import { useState, useEffect } from "react";
import dataFetcher from "~/libs/dataFetcher.server";
import { AnimeLink, PaginationLink } from "~/interfaces/interfaces";
import CardList from "~/components/CardList";
import Pagination from "~/components/Pagination";
import { baseUrl } from "~/libs/dataFetcher.server";
import HeaderComps from "~/components/HeaderComps";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | AnimeX" },
    { name: "description", content: "unofficial anime streamig website!" },
  ];
};

export let loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") || "1";
  const fetcher = new dataFetcher();

  const { animeLinks, pagination } = await fetcher.aniFetch(
    page === "1" ? undefined : `${baseUrl}/page/${page}`
  );
  const movie: AnimeLink[] = await fetcher.MovieList();

  return { animeLinks, movie, pagination };
};

export default function Index() {
  const { animeLinks, movie, pagination } = useLoaderData<{
    animeLinks: AnimeLink[];
    movie: AnimeLink[];
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
        <HeaderComps title="Anime Terbaru" />
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
        <HeaderComps title="Movie" link="/movie" />
        <div className="w-full my-4">
          <CardList data={movie} loading={loading} />
        </div>
      </main>
    </>
  );
}
