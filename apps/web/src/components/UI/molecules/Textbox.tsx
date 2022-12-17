import React, { forwardRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-height: 7.5rem;
  width: 100%;
  max-width: 60rem;
  border-radius: 0.5rem;
  padding: 0.8rem;
  display: flex;
  overflow: hidden;
  position: relative;
  background-color: #eceff4;
  font-size: 0.9rem;
`;

const Placeholder = styled.span`
  visibility: ${(p) => (p["aria-hidden"] ? "hidden" : "visible")};
  position: absolute;
  top: 15px;
  color: #828997;
`;

const Input = styled.div`
  min-height: 20px;
  max-height: 100px;
  width: 100%;
  max-width: inherit;
  color: ${(p) => (p.theme.state === "light" ? p.theme.colorAccent : p.theme.colorAccentText)};
  font-family: inherit;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-y: visible;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
  padding-right: 0.3rem;
  line-height: 1.6;
  outline: none;
  user-select: text;
  bottom: 1.5px;
  &::-webkit-scrollbar-thumb {
    background-color: #828997;
  }
`;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
}

const TextBox = forwardRef<HTMLDivElement, Props>(({ value, placeholder, onChange, ...props }, ref) => (
  <Container>
    <Placeholder aria-hidden={value.length > 0}>{placeholder}</Placeholder>
    <Input ref={ref} role="textbox" spellCheck contentEditable onInput={onChange} {...props} />
  </Container>
));

export default TextBox;
