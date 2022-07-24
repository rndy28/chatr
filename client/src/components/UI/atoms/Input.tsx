import React, { forwardRef } from "react";
import styled, { css, CSSProp } from "styled-components";
import type { Position, Size, Variant } from "libs/types";

const sm = css`
  height: 2.3rem;
  max-width: 20rem;
`;

const md = css`
  height: 2.6rem;
  max-width: 25rem;
`;

const lg = css`
  height: 2.8rem;
  max-width: 30rem;
`;

const primary = css`
  background-color: #fffdfd;
  color: #434c5e;
`;

const secondary = css`
  background-color: #eceff4;
  color: #434c5e;
`;

const neutral = css`
  border-bottom: 2px solid #5e81ac;
  border-radius: 0;
  padding-inline: 0;
`;

const baseInput = css<{ elementSize: Size; variant: Variant }>`
  width: 100%;
  padding-inline: 0.8rem;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  outline: none;
  transition: all 150ms ease-in;
  border: 1px solid transparent;
  ${(p) => p.elementSize === "sm" && sm}
  ${(p) => p.elementSize === "md" && md}
  ${(p) => p.elementSize === "lg" && lg}
  ${(p) => p.variant === "primary" && primary}
  ${(p) => p.variant === "secondary" && secondary}
  ${(p) => p.variant === "neutral" && neutral}
  &::placeholder {
    color: #828997;
  }
`;

const StyledInput = styled.input<{ elementSize: Size; variant: Variant }>`
  ${baseInput}
  ${(p) =>
    p["aria-invalid"] &&
    css`
      border-color: #bf616a;
    `}
`;

const Wrapper = styled.div<{
  position: Position;
  invalid: boolean;
  elementSize: Size;
  variant: Variant;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  ${baseInput}
  ${StyledInput} {
    background-color: transparent;
    border: none;
    border-radius: 0;
    padding-inline: 0;
  }
  ${(p) =>
    p.invalid &&
    css`
      border-color: #bf616a !important;
    `}
  ${(p) =>
    p.position === "right" &&
    css`
      flex-direction: row-reverse;
    `}
`;

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  elementSize: Size;
  variant: Variant;
  withIcon?: {
    position: Position;
  };
  cssProps?: CSSProp<any>;
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ children, withIcon, elementSize, variant, cssProps, ...props }, ref) => {
    if (withIcon) {
      return (
        <Wrapper
          position={withIcon.position}
          invalid={props["aria-invalid"] as boolean}
          elementSize={elementSize}
          variant={variant}
          css={cssProps}
        >
          {children}
          <StyledInput ref={ref} elementSize={elementSize} variant={variant} {...props} />
        </Wrapper>
      );
    }
    return <StyledInput ref={ref} elementSize={elementSize} variant={variant} {...props} />;
  },
);

export default Input;
