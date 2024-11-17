import { useState } from "react";

const useHamburgerClass = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const hamburgerClass = isOpen
    ? "fixed right-0 pr-4 z-20"
    : "absolute right-0 pr-4 z-20";

  return [hamburgerClass, handleToggle, isOpen] as const;
};

export default useHamburgerClass;
