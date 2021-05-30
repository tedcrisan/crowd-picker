import { useState, useEffect, useRef } from "react";

const useClickOutside = (initial) => {
  const [isVisible, setIsVisible] = useState(initial);
  const ref = useRef(null);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setIsVisible(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return [ref, isVisible, setIsVisible];
};

export default useClickOutside;
