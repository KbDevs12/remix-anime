import { MetaFunction } from "@remix-run/react";
import { FaGithub } from "react-icons/fa";
import { projectData } from "~/libs/data";

export const meta: MetaFunction = () => {
  return [
    { title: "About | AnimeX" },
    { name: "description", content: "unofficial anime streamig website!" },
  ];
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* About Section */}
      <section className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-violet-600">
          About This Website
        </h1>
        <p className="text-lg mt-4 text-white">
          This website is built using <strong>Remix</strong> and utilizes{" "}
          <strong>Cheerio</strong> and <strong>Axios</strong> to scrape data,
          all written in <strong>TypeScript</strong>. It is designed for
          educational purposes, focusing on web scraping techniques.
        </p>
        <p className="text-lg mt-4 text-white">
          The purpose of this site is to provide an example of how to use web
          scraping to gather publicly available information for learning and
          experimentation.
        </p>
      </section>

      {/* GitHub Profile Card */}
      <section className="text-center mb-8">
        <h2 className="text-xl font-semibold">GitHub Profile</h2>
        <div className="bg-white shadow-lg rounded-lg p-6 mt-4 max-w-sm mx-auto">
          <div className="flex flex-row gap-4 items-center space-x-4">
            <FaGithub size={40} className="text-gray-800" />
            <div className="flex flex-col items-start justify-start">
              <h3 className="text-lg font-bold">KbDevs12</h3>
              <p className="text-sm text-gray-500">Website Developer</p>
              <a
                href="https://github.com/Kbdevs12"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition duration-300"
              >
                Visit GitHub Profile
              </a>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl text-white font-semibold text-center mb-4">
          Other Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projectData.map((project) => (
            <div
              key={project.id}
              className="bg-violet-800 shadow-lg rounded-lg p-6"
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-sm text-white mt-2">{project.description}</p>
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition duration-300 mt-4 block"
              >
                View Project
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Credits Section */}
      <section className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Data used in this project is scraped from{" "}
          <a
            href="https://anoboy.icu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-500 transition duration-300"
          >
            Anoboy
          </a>
        </p>
      </section>
    </div>
  );
}
