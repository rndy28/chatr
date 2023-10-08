import React, { forwardRef } from "react";
import styled, { css, CSSProp } from "styled-components";
import type { Position, Size, Variant } from "~/types";

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

const baseInput = css<{ variant?: Variant }>`
  padding-inline: 0.8rem;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  outline: none;
  transition: all 150ms ease-in;
  border: 1px solid transparent;
  ${(p) => p.variant === "primary" && primary}
  ${(p) => p.variant === "secondary" && secondary}
  ${(p) => p.variant === "neutral" && neutral}
  &::placeholder {
    color: #828997;
  }
`;

const StyledInput = styled.input<{ variant?: Variant }>`
  ${baseInput}
  ${(p) =>
    p["aria-invalid"] &&
    css`
      border-color: #bf616a;
    `}
`;

interface ContainerProps {
  position: Position;
  invalid: boolean;
  variant: Variant;
}

const Container = styled.div<ContainerProps>`
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
    height: 100%;
    width: 100%;
    ${(p) => p.variant !== "neutral" && "width: 90%;"}
  }

  ${(p) =>
    p.position === "right" &&
    css`
      flex-direction: row-reverse;
    `}
  ${(p) =>
    p.invalid &&
    css`
      border-color: #bf616a !important;
    `}
`;

interface Props extends Omit<React.ComponentPropsWithoutRef<"input">, "size"> {
  size: Size;
  variant: Variant;
  icon?: {
    position: Position;
    element: React.ReactNode;
  };
  htmlSize?: number;
  cssProps?: CSSProp<any>;
}

const sizeMapped = {
  sm,
  md,
  lg,
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ children, icon, size, variant, cssProps, htmlSize, ...props }, ref) => {
    const actualSize = sizeMapped[size];

    if (icon) {
      return (
        <Container
          position={icon.position}
          invalid={props["aria-invalid"] as boolean}
          variant={variant}
          css={`
            ${actualSize}
            ${cssProps}
          `}
        >
          {icon.element}
          <StyledInput variant={variant} size={htmlSize} ref={ref} {...props} />
        </Container>
      );
    }
    return <StyledInput variant={variant} size={htmlSize} ref={ref} css={actualSize} {...props} />;
  }
);

export default Input;
