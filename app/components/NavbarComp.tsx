import { Squeeze as Hamburger } from "hamburger-react";
import { useState } from "react";
import { Form, Link, useNavigate, useSubmit } from "@remix-run/react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import useHamburgerClass from "~/hooks/useHamburger";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function NavbarComps({ onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const submit = useSubmit();
  const [hamburgerClass, handleToggle, isMenuOpen] = useHamburgerClass();

  const sidebarVariants = {
    closed: { x: "100%" },
    open: { x: "0% " },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      submit(e.currentTarget as HTMLFormElement);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-row items-center justify-between gap-4 p-4 bg-violet-600">
        <Link
          to={"/"}
          className="font-bold text-3xl cursor-pointer hover:text-white transition-colors duration-300"
        >
          AnimeX
        </Link>
        <ul className="flex flex-row gap-4 text-xl font-semibold">
          <li className="hover:text-white transition-colors duration-300">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-white transition-colors duration-300">
            <Link to="/category/anime">Anime</Link>
          </li>
          <li className="hover:text-white transition-colors duration-300">
            <Link to="/about">About</Link>
          </li>
        </ul>
        <Form
          method="get"
          action="/search"
          onSubmit={handleSubmit}
          className="relative"
        >
          <div className="flex items-center">
            <input
              type="search"
              name="q"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search anime..."
              className="w-64 px-4 py-2 pl-10 rounded-lg border-4 border-violet-950 focus:outline-none focus:border-violet-800 transition-colors duration-300"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </Form>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex flex-row items-center justify-between p-4 bg-violet-600">
        <p className="font-semibold text-xl cursor-pointer hover:text-white transition-colors duration-300">
          AnimeX
        </p>
        <div className={hamburgerClass}>
          <Hamburger toggled={isMenuOpen} toggle={handleToggle} />
        </div>
        {isMenuOpen && (
          <motion.div
            className="fixed flex flex-col z-10 top-0 right-0 w-3/4 h-full bg-violet-600 shadow-xl transition-transform duration-300"
            initial="closed"
            animate={isMenuOpen ? "open" : "closed"}
            exit={"closed"}
            variants={sidebarVariants}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 500,
            }}
          >
            <div className="flex flex-col gap-6 pt-20 px-5">
              <Form
                method="get"
                action="/search"
                onSubmit={handleSubmit}
                className="relative"
              >
                <div className="flex items-center">
                  <input
                    type="search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search anime..."
                    className="w-full px-4 py-2 pl-10 rounded-lg border-4 border-violet-950 focus:outline-none focus:border-violet-800 transition-colors duration-300"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </Form>

              <ul className="flex flex-col gap-4 text-xl font-semibold">
                <li className="hover:text-white transition-colors duration-300">
                  <Link to="/">Home</Link>
                </li>
                <li className="hover:text-white transition-colors duration-300">
                  <Link to="/category/anime">Anime</Link>
                </li>
                <li className="hover:text-white transition-colors duration-300">
                  <Link to="/about">About</Link>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}
