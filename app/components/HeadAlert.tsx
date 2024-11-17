import { motion } from "framer-motion";

export default function HeadAlert() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center font-bold pt-5 text-center"
      animate={{
        opacity: [1, 0, 1],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
      }}
    >
      <p className="text-2xl text-yellow-500">Warning Unofficial API</p>
      <p className="text-xl text-white">
        website ini hasil scrap data dari{" "}
        <a className="underline" href="https://anoboy.icu">
          ANOBOY
        </a>{" "}
        Hanya untuk belajar.
      </p>
    </motion.div>
  );
}
