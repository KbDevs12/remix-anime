import { FaFacebookF, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-violet-600 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-6 md:space-y-0 gap-2">
        <div className="-ml-8">
          <h1 className="text-lg font-bold">Copyright © AnimeX 2024</h1>
          <p className="text-sm">
            This website is created for educational purposes only.
          </p>
          <p className="text-sm mt-2">
            This project is licensed under the{" "}
            <a
              href="https://www.gnu.org/licenses/gpl-3.0.en.html"
              className="text-blue-300 hover:text-blue-500 transition duration-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              GNU General Public License
            </a>
            , allowing public use and modification.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-base">Credits:</h2>
          <a
            href="https://anoboy.icu"
            className="text-blue-300 hover:text-blue-500 transition duration-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Anoboy
          </a>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-blue-500 transition duration-300"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="hover:text-blue-400 transition duration-300"
          >
            <FaTwitter size={24} />
          </a>
          <a
            href="https://www.instagram.com/adttptra_11"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-500 transition duration-300"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://github.com/KbDevs12"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-gray-400 transition duration-300"
          >
            <FaGithub size={24} />
          </a>
        </div>
        <div className="mt-4">
          <a
            href="https://github.com/remix-anime"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300"
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
