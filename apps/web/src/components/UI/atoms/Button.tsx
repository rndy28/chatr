import React, { forwardRef } from "react";
import styled, { css, keyframes } from "styled-components";
import type { Size, Variant } from "~/types";

interface StyledButtonProps {
  variant: Variant;
  size: Size;
  loading?: boolean;
  withIcon?: boolean;
  disabled?: boolean;
}

const spin1 = keyframes`
     0%    {clip-path: polygon(50% 50%,0       0,  50%   0%,  50%    0%, 50%    0%, 50%    0%, 50%    0% )}
   12.5% {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100%   0%, 100%   0%, 100%   0% )}
   25%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 100% 100%, 100% 100% )}
   50%   {clip-path: polygon(50% 50%,0       0,  50%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   62.5% {clip-path: polygon(50% 50%,100%    0, 100%   0%,  100%   0%, 100% 100%, 50%  100%, 0%   100% )}
   75%   {clip-path: polygon(50% 50%,100% 100%, 100% 100%,  100% 100%, 100% 100%, 50%  100%, 0%   100% )}
   100%  {clip-path: polygon(50% 50%,50%  100%,  50% 100%,   50% 100%,  50% 100%, 50%  100%, 0%   100% )}
`;

const spin2 = keyframes`
    0%    {transform:scaleY(1)  rotate(0deg)}
  49.99%{transform:scaleY(1)  rotate(135deg)}
  50%   {transform:scaleY(-1) rotate(0deg)}
  100%  {transform:scaleY(-1) rotate(-135deg)}
`;

const ButtonLoader = styled.div`
  width: 1.8rem;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid #eceff4;
  animation: ${spin1} 0.8s infinite linear alternate, ${spin2} 1.6s infinite linear;
`;

const primary = css`
  background-color: #3b4252;
  color: #f2eafb;
  &:hover {
    background-color: #4c566a;
  }
`;

const secondary = css`
  background-color: #5e81ac;
  color: #e6e6e6;
  &:hover {
    background-color: #81a1c1;
  }
`;

const sm = css`
  height: 2.5rem;
  max-width: 6rem;
  font-size: 0.93rem;
`;

const md = css`
  height: 2.8rem;
  max-width: 10rem;
`;

const lg = css`
  height: 3rem;
  max-width: 11rem;
`;

const Container = styled.button<StyledButtonProps>`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  width: 100%;
  font-size: 1rem;
  font-weight: 400;
  transition: all 250ms ease;
  ${(p) => p.size === "sm" && sm}
  ${(p) => p.size === "md" && md}
  ${(p) => p.size === "lg" && lg}
  ${(p) => p.variant === "primary" && primary}
  ${(p) => p.variant === "secondary" && secondary}
    ${(p) =>
    p.withIcon &&
    css`
      gap: 0.5rem;
    `}
    ${(p) =>
    p.disabled &&
    css`
      box-shadow: 0 1px 0 rgb(0 0 0 / 45%);
      opacity: 0.7;
      span {
        display: none;
      }
    `}
`;

interface Props extends React.ComponentPropsWithoutRef<"button">, StyledButtonProps {}

const Button = forwardRef<HTMLButtonElement, Props>(({ children, loading, ...props }, ref) => (
  <Container ref={ref} disabled={loading ? true : undefined} {...props}>
    {loading ? <ButtonLoader /> : children}
  </Container>
));

export default Button;
