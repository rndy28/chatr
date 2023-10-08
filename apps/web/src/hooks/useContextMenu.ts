import React, { useCallback, useEffect, useState } from "react";

interface AnchorPoint {
  y: number;
  x: number;
}

const useContextMenu = <RefType extends HTMLElement>(
  ref: React.RefObject<RefType>,
  menuRef: React.RefObject<RefType>
): [AnchorPoint, boolean] => {
  const [show, setShow] = useState(false);
  const [anchorPoint, setAnchorPoint] = useState({
    y: 0,
    x: 0,
  });

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const containsMenu = menuRef.current?.contains(target as Node);
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      if (ref.current?.contains(target as Node) || containsMenu) {
        if (containsMenu) return;
        setAnchorPoint({
          x: event.pageX,
          y: event.pageY,
        });
        setShow((c) => !c);
      } else {
        setShow(false);
      }
    },
    [setShow, setAnchorPoint]
  );

  const onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && menuRef.current) {
      setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return [anchorPoint, show];
};

export default useContextMenu;
