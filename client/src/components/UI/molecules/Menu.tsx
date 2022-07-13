import styled from "styled-components";
import { motion, HTMLMotionProps } from "framer-motion";
import { useMemo } from "react";

const Container = styled(motion.div)`
  width: fit-content;
  height: fit-content;
  min-width: 10rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0.5rem 5rem 0.5rem rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  padding-block: 0.5rem;
  position: absolute;
`;

const Item = styled.div`
  font-size: 0.813rem;
  width: 100%;
  height: 2rem;
  display: flex;
  align-items: center;
  color: #1a374d;
  padding-inline: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

interface Props extends HTMLMotionProps<"div"> {
  menuRef: React.RefObject<HTMLDivElement>;
  anchorPoint: {
    x: number;
    y: number;
  };
}

const Menu = ({ children, menuRef, anchorPoint, ...props }: Props) => {
  const menuVariant = useMemo(
    () => ({
      visible: {
        opacity: 1,
        scale: 1,
        left: anchorPoint.x,
        top: anchorPoint.y,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
      hidden: {
        opacity: 0,
        scale: 0,
        left: anchorPoint.x,
        top: anchorPoint.y,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      },
    }),
    [anchorPoint]
  );

  return (
    <Container
      role="menu"
      variants={menuVariant}
      initial="hidden"
      animate="visible"
      exit="hidden"
      ref={menuRef}
      {...props}
    >
      {children}
    </Container>
  );
};

Menu.Item = Item;

export default Menu;
