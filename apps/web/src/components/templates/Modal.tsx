import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { modalVariant } from "~/animation";

const Container = styled(motion.div)`
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  & > *:first-child {
    background-color: #fff;
    border-radius: 0.4rem;
  }
`;

const Title = styled.h1`
  color: ${(p) => p.theme.colorText};
  font-size: 1.5rem;
`;

interface Props extends HTMLMotionProps<"div"> {}
interface PropsTitle extends React.ComponentPropsWithoutRef<"h1"> {}

const Modal = ({ children, ...props }: Props) =>
  createPortal(
    <Container role="dialog" variants={modalVariant} initial="hidden" animate="visible" exit="hidden" {...props}>
      {children}
    </Container>,
    document.getElementById("root")!
  );

Modal.Title = ({ children, ...rest }: PropsTitle) => <Title {...rest}>{children}</Title>;

export default Modal;
