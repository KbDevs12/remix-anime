import { Link } from "@remix-run/react";
import { CardProps } from "~/interfaces/interfaces";
import { encodeUrl } from "~/libs/urlCiphers";
import { motion } from "framer-motion";

export default function Card({ image, title, id, href }: CardProps) {
  const encodedHref = encodeUrl(href);

  const imageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } },
  };

  return (
    <Link to={`/anime/${id}?id=${encodedHref}`}>
      <motion.div
        className="w-full max-w-sm bg-violet-700 shadow-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="aspect-[16/9] overflow-hidden"
          variants={imageVariants}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </motion.div>
        <motion.div className="p-4" variants={textVariants}>
          <h3 className="text-lg font-semibold text-white line-clamp-2 h-14 text-center">
            {title}
          </h3>
        </motion.div>
      </motion.div>
    </Link>
  );
}
