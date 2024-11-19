import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import * as cheerio from "cheerio";
import {
  AnimeLink,
  detailsAnimeEps,
  PaginationLink,
} from "~/interfaces/interfaces";

export const baseUrl = "https://anoboy.icu";
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

export default class dataFetcher {
  private extractPageNumber(href: string): number | null {
    const match = href.match(/\/page\/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  private getSrcFromIframe(html: string) {
    const $ = cheerio.load(html);
    const scriptElement = $("script");
    const scriptText = scriptElement.text();

    const iframeSrcMatch = scriptText.match(
      /iframe\.setAttribute\('src', '([^']+)'/
    );
    if (iframeSrcMatch && iframeSrcMatch.length > 1) {
      return iframeSrcMatch[1];
    }
    return null;
  }

  private parseEps(input: string): { id: string } {
    try {
      const cleanPath = input.replace(baseUrl, "").replace(/^\//, "");
      const match = cleanPath.match(/\d{4}\/\d{2}\/([\w-]+)/);

      if (!match) {
        return { id: "" };
      }

      const id = match[1];

      return { id };
    } catch (error) {
      console.error("Error parsing eps and id: ", error);
      return { id: "" };
    }
  }

  private parsePagination($: cheerio.CheerioAPI): PaginationLink[] {
    const paginationLinks: PaginationLink[] = [];

    $(".wp-pagenavi a").each((_, element) => {
      const $element = $(element);
      const href = $element.attr("href");
      const text = $element.text().trim();

      if (href) {
        const pageNumber = this.extractPageNumber(href);
        if (pageNumber) {
          paginationLinks.push({
            href,
            text,
            page: pageNumber,
          });
        }
      }
    });

    return paginationLinks.sort((a, b) => a.page - b.page);
  }

  public async aniFetch(
    url: string = baseUrl,
    axiosConfig?: AxiosRequestConfig<any>,
    callback?: (response: AxiosResponse) => void
  ): Promise<{
    animeLinks: AnimeLink[];
    pagination: {
      links: PaginationLink[];
      currentPage: number;
      totalPages: number;
    };
  }> {
    const response = await axios({
      url,
      headers: {
        ...axiosConfig?.headers,
        "User-Agent": userAgent,
      },
      ...axiosConfig,
    });

    if (callback) callback(response);

    const $ = cheerio.load(response.data);

    const animeLinks: AnimeLink[] = [];

    $(".home_index a").each((_, element) => {
      const href = $(element).attr("href");
      const title = $(element).attr("title");
      const imageElement = $(element).find(".amv amp-img");

      const imageSource = imageElement.attr("src");
      const image = imageSource ? `${baseUrl}${imageSource}` : "";

      if (href && title && image) {
        const parsedData = this.parseEps(href);
        animeLinks.push({
          href,
          title,
          image,
          ...(parsedData ? parsedData : ""),
        });
      }
    });

    const paginationLinks = this.parsePagination($);
    const currentPage = this.extractPageNumber(url) || 1;
    const totalPages =
      paginationLinks.length > 0
        ? Math.max(...paginationLinks.map((link) => link.page))
        : 1;

    return {
      animeLinks,
      pagination: {
        links: paginationLinks,
        currentPage,
        totalPages,
      },
    };
  }

  public async MovieList(
    url: string = baseUrl,
    axiosConfig?: AxiosRequestConfig<any>,
    callback?: (response: AxiosResponse) => void
  ) {
    const response = await axios({
      url,
      headers: {
        ...axiosConfig?.headers,
        "User-Agent": userAgent,
      },
      ...axiosConfig,
    });

    if (callback) callback(response);

    const $ = cheerio.load(response.data);

    const Movie: AnimeLink[] = [];

    $(".side_home a").each((_, element) => {
      const href = $(element).attr("href");
      const title = $(element).attr("title");
      const imageElement = $(element).find("#amv amp-img");

      const imageSource = imageElement.attr("src");
      const image = imageSource ? `${baseUrl}${imageSource}` : "";

      if (href && title && image) {
        const parsedData = this.parseEps(href);
        Movie.push({ href, title, image, ...(parsedData ? parsedData : "") });
      }
    });
    return Movie;
  }

  public async searchAnime(
    query: string,
    page: string,
    axiosConfig?: AxiosRequestConfig<any>,
    callback?: (response: AxiosResponse) => void
  ): Promise<{
    animeLinks: AnimeLink[];
    pagination: {
      links: PaginationLink[];
      currentPage: number;
      totalPages: number;
    };
  }> {
    const searchUrl =
      page === "1"
        ? `${baseUrl}?s=${encodeURIComponent(query)}`
        : `${baseUrl}/page/${page}?s=${encodeURIComponent(query)}`;
    const response = await axios({
      url: searchUrl,
      headers: {
        ...axiosConfig?.headers,
        "User-Agent": userAgent,
      },
      ...axiosConfig,
    });

    if (callback) callback(response);

    const $ = cheerio.load(response.data);
    let animeLinks: AnimeLink[] = [];

    $(".column-content a").each((_, element) => {
      const $element = $(element);
      const href = $element.attr("href");
      const title = $element.attr("title");
      const imageElement = $element.find(".amv amp-img");
      const imageSource = imageElement.attr("src");
      const image = imageSource?.startsWith("http")
        ? imageSource
        : `${baseUrl}${imageSource}`;

      if (href && title && image) {
        const parsedData = this.parseEps(href);

        animeLinks.push({
          href,
          title,
          image,
          ...(parsedData ? parsedData : ""),
        });
      }
    });

    if (animeLinks.length > 1) {
      animeLinks = animeLinks.slice(0, -1);
    }

    const paginationLinks = this.parsePagination($);
    const currentPage = this.extractPageNumber(searchUrl) || 1;
    const totalPages =
      paginationLinks.length > 0
        ? Math.max(...paginationLinks.map((link) => link.page))
        : 1;
    return {
      animeLinks,
      pagination: {
        links: paginationLinks,
        currentPage,
        totalPages,
      },
    };
  }

  public async getDetailsAnime(
    url: string,
    axiosConfig?: AxiosRequestConfig<any>,
    callback?: (response: AxiosResponse) => void
  ): Promise<detailsAnimeEps> {
    const response = await axios({
      url,
      headers: {
        ...axiosConfig?.headers,
        "User-Agent": userAgent,
      },
      ...axiosConfig,
    });

    if (callback) callback(response);

    const $ = cheerio.load(response.data);

    const details: detailsAnimeEps = {
      tigaEnam: "",
      tujuhDua: "",
      thumbnail: "",
      description: "",
      title: "",
      studio: "",
      source: "",
      duration: "",
      genre: "",
      score: "",
      nextEpisode: { title: "", url: "", href: "" },
      prevEpisode: { title: "", url: "", href: "" },
      detailStream: [],
      titleA: "",
      detailDownload: [],
      type: "",
    };

    const t = $(".pagetitle h1").text();
    details.titleA = t;

    if (t.includes("[Streaming]")) {
      details.type = "Streaming";
    } else if (t.includes("[Download]")) {
      details.type = "Download";
    } else {
      details.type = "Anime";
    }

    if (details.type === "Streaming") {
      $(".satu a").each((_, element) => {
        const a = $(element).text();
        const b = $(element).attr("data-video");
        const link = b?.startsWith("http") ? b : baseUrl + b;

        if (!details.detailStream) {
          details.detailStream = [];
        }

        const streamEntry = {
          streamLink: [{ text: a, link }],
        };

        details.detailStream.push(streamEntry);
      });
      return details;
    } else if (details.type === "Download") {
      const imageSource = $(".column-three-fourth amp-img").attr("src");
      const image = imageSource?.startsWith("http")
        ? imageSource
        : `${baseUrl}${imageSource}`;
      details.detailDownload?.push({
        thumb: image,
      });

      if (!details.detailDownload) {
        details.detailDownload = [];
      }

      const downloadEntry = {
        batchLink: [] as Array<{
          rz?: string;
          rzLink?: string;
          mega?: string;
          megaLink?: string;
        }>,
        single1080: [] as Array<{ episode?: string; link?: string }>,
        single720: [] as Array<{ episode?: string; link?: string }>,
        single480: [] as Array<{ episode?: string; link?: string }>,
        single360: [] as Array<{ episode?: string; link?: string }>,
        single240: [] as Array<{ episode?: string; link?: string }>,
      };

      $(".satuk tbody tr:not(:first-child)").each((_, element) => {
        const episode = $(element).find("td:first-child").text();
        const link = $(element).find("td:nth-child(2) a").attr("href");

        downloadEntry.single1080?.push({
          episode: episode,
          link: link,
        });
      });

      $(".tujuduapuluh tbody tr:not(:first-child)").each((_, element) => {
        const episode = $(element).find("td:first-child").text();
        const link = $(element).find("td:nth-child(2) a").attr("href");

        downloadEntry.single720?.push({
          episode: episode,
          link: link,
        });
      });

      $(".empatlapanpuluh tbody tr:not(:first-child)").each((_, element) => {
        const episode = $(element).find("td:first-child").text();
        const link = $(element).find("td:nth-child(2) a").attr("href");

        downloadEntry.single480?.push({
          episode: episode,
          link: link,
        });
      });

      $(".tigaenampuluh tbody tr:not(:first-child)").each((_, element) => {
        const episode = $(element).find("td:first-child").text();
        const link = $(element).find("td:nth-child(2) a").attr("href");

        downloadEntry.single360?.push({
          episode: episode,
          link: link,
        });
      });

      $(".duaemapatpuluh tbody tr:not(:first-child)").each((_, element) => {
        const episode = $(element).find("td:first-child").text().trim();
        const link = $(element).find("td:nth-child(2) a").attr("href");

        downloadEntry.single240?.push({
          episode: episode,
          link: link,
        });
      });

      interface LinkMap {
        [key: string]: string;
      }

      let rzLinks: LinkMap = {};
      let megaLinks: LinkMap = {};

      $(".unduhan .ud").each((_, element) => {
        const provider = $(element).find(".udj").text().trim();
        const links = $(element).find(".udl");

        links.each((_, link) => {
          const $link = $(link);
          const quality = $link.text().trim();
          const href = $link.attr("href") || "";

          if (href === "none") return;

          if (provider === "RZ") {
            rzLinks[quality] = href;
          } else if (provider === "Mega") {
            megaLinks[quality] = href;
          }
        });
      });

      ["240P", "SD360P", "480P", "720P", "1K"].forEach((quality) => {
        if (rzLinks[quality] || megaLinks[quality]) {
          downloadEntry.batchLink.push({
            rz: quality,
            rzLink: rzLinks[quality] || "",
            mega: quality,
            megaLink: megaLinks[quality] || "",
          });
        }
      });
      details.detailDownload.push(downloadEntry);
      return details;
    }

    const hasNextPrev = $(".widget-title");
    let prevEpisode: {
      title: string;
      url: string;
      href: string;
    } = {
      title: "",
      url: "",
      href: "",
    };
    let nextEpisode: { title: string; url: string; href: string } = {
      title: "",
      url: "",
      href: "",
    };

    if (hasNextPrev.length === 1) {
      const links = $(hasNextPrev).find("a");
      const urls = links.attr("href") || "";
      const ref = this.parseEps(urls);
      prevEpisode = {
        title: links.text(),
        url: urls,
        href: ref?.id,
      };
    } else if (hasNextPrev.length === 2) {
      hasNextPrev.each((_, element) => {
        const linksS = $(element).find("a");
        const urls = linksS.attr("href") || "";
        const ref = this.parseEps(urls);
        if (_ === 0) {
          prevEpisode = {
            title: linksS.text(),
            url: urls,
            href: ref?.id,
          };
        } else if (_ === 1) {
          const urls = linksS.attr("href") || "";
          const ref = this.parseEps(urls);
          nextEpisode = {
            title: linksS.text(),
            url: urls,
            href: ref.id,
          };
        }
      });
    }
    details.prevEpisode = prevEpisode;
    details.nextEpisode = nextEpisode;

    const iframeSrc = $(".column-three-fourth iframe").attr("src");
    if (!iframeSrc) {
      throw new Error("Iframe source not found");
    }

    const iframeResponse = await axios({
      url: iframeSrc.startsWith("http") ? iframeSrc : `${baseUrl}${iframeSrc}`,
      headers: {
        ...axiosConfig?.headers,
        "User-Agent": userAgent,
      },
    });

    const iframeContent = cheerio.load(iframeResponse.data);

    const urlTigaEnam = iframeContent("#tigaenam").attr("href") || "";
    details.tigaEnam = urlTigaEnam || "";

    const urlTigaTujuh = iframeContent("#tigatuju").attr("href") || "";
    details.tujuhDua = urlTigaTujuh || "";

    const thumbnailImg = $(".entry-content amp-img").first();
    const img = thumbnailImg.attr("src") || "";
    details.thumbnail = img?.startsWith("http") ? img : `${baseUrl}${img}`;
    details.description = $(".contentdeks").text().trim();

    const values: any[] = [];
    $(".contenttable tr").each((_, element) => {
      const tds = $(element).find("td");
      const value = $(tds)
        .map((_, td) => $(td).text())
        .get();
      values.push(value);
    });
    details.title = values[0];
    details.studio = values[1];
    details.source = values[2];
    details.duration = values[3];
    details.genre = values[4];
    details.score = values[5];

    return details;
  }

  public async animePage(
    url: string = baseUrl + "/category/anime",
    axiosConfig?: AxiosRequestConfig<any>,
    callback?: (response: AxiosResponse) => void
  ): Promise<{
    animeLinks: AnimeLink[];
    pagination: {
      links: PaginationLink[];
      currentPage: number;
      totalPages: number;
    };
  }> {
    const response = await axios({
      url,
      headers: {
        ...axiosConfig?.headers,
        "User-Agent": userAgent,
      },
      ...axiosConfig,
    });

    if (callback) callback(response);

    const $ = cheerio.load(response.data);

    const animeLinks: AnimeLink[] = [];

    $(".column-content a").each((_, element) => {
      const href = $(element).attr("href");
      const title = $(element).attr("title");
      const imageElement = $(element).find(".amv amp-img");

      const imageSource = imageElement.attr("src");
      const image = imageSource ? `${baseUrl}${imageSource}` : "";

      if (href && title && image) {
        const parsedData = this.parseEps(href);
        animeLinks.push({
          href,
          title,
          image,
          ...(parsedData ? parsedData : ""),
        });
      }
    });

    const paginationLinks = this.parsePagination($);
    const currentPage = this.extractPageNumber(url) || 1;
    const totalPages =
      paginationLinks.length > 0
        ? Math.max(...paginationLinks.map((link) => link.page))
        : 1;

    return {
      animeLinks,
      pagination: {
        links: paginationLinks,
        currentPage,
        totalPages,
      },
    };
  }
}
