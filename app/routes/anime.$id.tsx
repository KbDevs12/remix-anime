import { LoaderFunction } from "@remix-run/node";
import {
  Link,
  MetaFunction,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import DisqusComments from "~/components/DisqusComment";
import { detailsAnimeEps } from "~/interfaces/interfaces";
import dataFetcher, { baseUrl } from "~/libs/dataFetcher";
import { decodeUrl, encodeUrl } from "~/libs/urlCiphers";
interface loaderData {
  animeDetails: detailsAnimeEps;
}

export const meta: MetaFunction<typeof loader> = ({
  data,
}: {
  data: loaderData;
}) => {
  if (data?.animeDetails) {
    return [
      { title: `${data.animeDetails.title} | AnimeX` },
      { name: "description", content: "Unofficial anime streaming website!" },
    ];
  }

  return [
    { title: "Home | AnimeX" },
    { name: "description", content: "Unofficial anime streaming website!" },
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const fecher = new dataFetcher();
  const url = new URL(request.url);
  const encodedId = url.searchParams.get("id");

  try {
    if (!encodedId) {
      return new Response(JSON.stringify({ message: "No id provided." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let decodedHref = decodeUrl(encodedId);
    if (!decodedHref.includes("http"))
      return (decodedHref = baseUrl + decodedHref);

    if (!decodedHref) {
      return new Response(JSON.stringify({ message: "Invalid reference." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const animeDetails = await fecher.getDetailsAnime(decodedHref);
    return new Response(JSON.stringify({ animeDetails }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in loader:", error);

    return new Response(
      JSON.stringify({
        message: "An error occurred while processing the request.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export default function AnimeDetailPage() {
  const { animeDetails } = useLoaderData<loaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentQuality = searchParams.get("quality") || "360p";
  const currentStreamLink =
    searchParams.get("stream") ||
    animeDetails.detailStream?.[0]?.streamLink?.[0]?.link;

  const handleQualityChange = (quality: string) => {
    setSearchParams((prev) => {
      prev.set("quality", quality);
      return prev;
    });
  };

  const handleStreamChange = (streamLink: string) => {
    setSearchParams((prev) => {
      prev.set("stream", streamLink);
      return prev;
    });
  };
  console.log({ animeDetails });

  const StreamingContent = () => {
    if (!animeDetails.detailStream || animeDetails.detailStream.length === 0) {
      return <p className="text-red-500">No streaming links available.</p>;
    }

    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">
          {animeDetails.titleA}
        </h1>
        <div className="bg-violet-800 rounded-lg shadow-xl p-6">
          <div className="w-full h-full aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={currentStreamLink || ""}
              className="w-full h-full"
              allowFullScreen
            >
              Your browser does not support iframes.
            </iframe>
          </div>
          <p className="text-white py-4 text-xl font-semibold">
            Select episode:
          </p>
          <div className="mt-4 flex flex-wrap gap-2 px-2 justify-center items-center">
            {animeDetails.detailStream.map((stream, index) =>
              stream.streamLink?.map((link) => (
                <button
                  key={link.link}
                  onClick={() => handleStreamChange(link.link)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    currentStreamLink === link.link
                      ? "bg-green-500 text-white"
                      : "bg-violet-700 text-white hover:bg-violet-600"
                  }`}
                >
                  {link.text}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  let a, b;

  if (animeDetails.prevEpisode) {
    a = encodeUrl(animeDetails.prevEpisode.url);
  } else {
    return;
  }

  if (animeDetails.nextEpisode) {
    b = encodeUrl(animeDetails.nextEpisode.url);
  } else {
    return;
  }

  const qualityOptions = [
    { key: "single1080", label: "1080P" },
    { key: "single720", label: "720P" },
    { key: "single480", label: "480P" },
    { key: "single360", label: "360P" },
    { key: "single240", label: "240P" },
  ];

  const videoUrl =
    currentQuality === "720p" ? animeDetails.tujuhDua : animeDetails.tigaEnam;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {animeDetails.type === "Streaming" && <StreamingContent />}
      {animeDetails.type === "Download" && (
        <>
          <div className="bg-violet-700 rounded-lg p-4 space-y-4">
            <div className="flex flex-col gap-4 py-8 w-full rounded-lg items-center justify-center place-items-center">
              <p className="text-white hover:text-black text-xl font-semibold transition-colors duration-300 cursor-pointer">
                {animeDetails.titleA}
              </p>
              <img
                src={animeDetails.detailDownload?.[0]?.thumb}
                alt="gambar"
                className="rounded-lg"
              />
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Download Links
            </h2>

            {animeDetails.detailDownload?.[1]?.batchLink?.map(
              (quality, index) => (
                <div key={index} className="bg-violet-600 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {quality.rz}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quality.rzLink && (
                      <a
                        href={quality.rzLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-violet-500 hover:bg-violet-400 text-white py-2 px-4 rounded-lg text-center transition-colors"
                      >
                        RZ
                      </a>
                    )}
                    {quality.megaLink && (
                      <a
                        href={quality.megaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-violet-500 hover:bg-violet-400 text-white py-2 px-4 rounded-lg text-center transition-colors"
                      >
                        Mega
                      </a>
                    )}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="space-y-6">
            {qualityOptions.map(({ key, label }) => {
              const episodes = (
                animeDetails.detailDownload?.[1] as Record<string, any>
              )?.[key];

              if (!episodes || episodes.length === 0) return null;

              return (
                <div key={key} className="p-4 mt-8 rounded-lg bg-violet-700">
                  <p className="text-xl font-semibold text-white mb-4">
                    Single Link Download - {label}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-violet-600">
                          <th className="p-3 text-white font-semibold text-left">
                            Episode
                          </th>
                          <th className="p-3 text-white font-semibold text-left">
                            Link
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {episodes.map(
                          (
                            ep: { episode: string; link: string },
                            index: number
                          ) => (
                            <tr
                              key={index}
                              className="border-b border-violet-600"
                            >
                              <td className="p-3 text-white">{ep.episode}</td>
                              <td className="p-3">
                                <a
                                  href={ep.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-violet-500 hover:bg-violet-400 text-white py-2 px-4 rounded-lg inline-block transition-colors"
                                >
                                  Download
                                </a>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      {animeDetails.type !== "Streaming" &&
        animeDetails.type !== "Download" && (
          <>
            <div className="bg-violet-800 rounded-lg shadow-xl p-6">
              <h1 className="text-3xl font-bold text-white mb-6">
                {animeDetails.title}
              </h1>

              <div className="grid grid-cols-1 gap-8">
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                  <iframe
                    src={videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                  >
                    Your browser does not support iframes.
                  </iframe>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleQualityChange("360p")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentQuality === "360p"
                        ? "bg-green-500 text-white"
                        : "bg-violet-700 text-white hover:bg-violet-600"
                    }`}
                  >
                    360p
                  </button>
                  <button
                    onClick={() => handleQualityChange("720p")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentQuality === "720p"
                        ? "bg-green-500 text-white"
                        : "bg-violet-700 text-white hover:bg-violet-600"
                    }`}
                  >
                    720p
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <img
                      src={animeDetails.thumbnail}
                      alt={animeDetails.title}
                      className="w-full rounded-lg shadow-md"
                    />
                    <div className="mt-8 flex flex-row items-center justify-center gap-4">
                      {animeDetails.prevEpisode.url && (
                        <h3 className="text-xl font-medium bg-black p-4 rounded-xl hover:-translate-y-1 transition-transform duration-300 text-violet-500">
                          <Link
                            to={`/anime/${animeDetails.prevEpisode.href}?id=${a}`}
                          >
                            {animeDetails.prevEpisode.title}
                          </Link>
                        </h3>
                      )}
                      {animeDetails.nextEpisode.url && (
                        <h3 className="text-xl font-medium bg-black p-4 rounded-xl hover:-translate-y-1 transition-transform duration-300 text-violet-500">
                          <Link
                            to={`/anime/${animeDetails.prevEpisode.href}?id=${b}`}
                          >
                            {animeDetails.nextEpisode.title}
                          </Link>
                        </h3>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="bg-violet-700 rounded-lg p-4 mb-6">
                      <table className="w-full text-white">
                        <tbody>
                          <tr>
                            <td className="py-2 font-semibold">Studio</td>
                            <td className="py-2">{animeDetails.studio}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold">Source</td>
                            <td className="py-2">{animeDetails.source}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold">Duration</td>
                            <td className="py-2">{animeDetails.duration}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold">Genre</td>
                            <td className="py-2">{animeDetails.genre}</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-semibold">Score</td>
                            <td className="py-2">{animeDetails.score}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-violet-700 rounded-lg p-4">
                      <h2 className="text-xl font-semibold mb-3 text-white">
                        Description
                      </h2>
                      <p className="text-gray-200">
                        {animeDetails.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DisqusComments
                title={animeDetails.titleA}
                id={animeDetails.title}
              />
            </div>
          </>
        )}
    </div>
  );
}
