import styled, { keyframes } from "styled-components";
import type { Size } from "libs/types";

const rotate = keyframes`
   100% {transform: rotate(1turn)}
`;

const Container = styled.div<{ size: Size }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  & > div {
    width: ${(p) => (p.size === "lg" ? "50" : p.size === "md" ? "35" : "25")}px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: ${(p) => (p.size === "lg" ? "5" : p.size === "md" ? "4" : "3")}px
      solid #0000;
    border-right-color: #434c5e;
    position: relative;
    animation: ${rotate} 1s infinite linear;
  }
  & > div:before,
  & > div:after {
    content: "";
    position: absolute;
    inset: -${(p) => (p.size === "lg" ? "5" : p.size === "md" ? "4" : "3")}px;
    border-radius: 50%;
    border: inherit;
    animation: inherit;
    animation-duration: 2s;
  }
  & > div:after {
    animation-duration: 4s;
  }
`;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  size?: Size;
}

const Loader = ({ size = "lg", ...props }: Props) => {
  return (
    <Container size={size} {...props}>
      <div></div>
    </Container>
  );
};

export default Loader;
