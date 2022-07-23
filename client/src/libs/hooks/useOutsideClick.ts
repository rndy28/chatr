import React, { useEffect } from "react";

const useOutsideClick = <RefType extends HTMLElement>(
  ref: React.RefObject<RefType>,
  callback: (event: MouseEvent) => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!ref.current || ref.current.contains(target as Node)) return;

      callback(event);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, callback]);
};

export default useOutsideClick;
