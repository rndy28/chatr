import {
  IconArrowNarrowLeft,
  IconCheck,
  IconDotsVertical,
  IconMessage,
  IconSearch,
  IconSend,
  IconX,
} from "@tabler/icons";
import { forwardRef } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a1a1a1;
  transition: background-color 0.3s ease;
  &[role="button"] {
    cursor: pointer;
    &:hover {
      background-color: #f5f5f5;
    }
  }
  svg {
    height: 1.5rem;
    width: 1.5rem;
  }
`;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  name: string;
}

const IconMapper = forwardRef<HTMLDivElement, Props>(
  ({ name, ...props }, ref) => {
    switch (name) {
      case "dots-vertical":
      case "options":
        return (
          <Wrapper ref={ref} {...props}>
            <IconDotsVertical />
          </Wrapper>
        );
      case "message":
        return (
          <Wrapper ref={ref} {...props}>
            <IconMessage />
          </Wrapper>
        );
      case "search":
        return (
          <Wrapper ref={ref} {...props}>
            <IconSearch />
          </Wrapper>
        );
      case "send":
        return (
          <Wrapper ref={ref} {...props}>
            <IconSend />
          </Wrapper>
        );
      case "close":
        return (
          <Wrapper ref={ref} {...props}>
            <IconX />
          </Wrapper>
        );
      case "back":
        return (
          <Wrapper ref={ref} {...props}>
            <IconArrowNarrowLeft />
          </Wrapper>
        );
      case "check":
        return (
          <Wrapper ref={ref} {...props}>
            <IconCheck />
          </Wrapper>
        );
      default:
        throw new Error(`Unknown icon name: ${name}`);
    }
  }
);

export default IconMapper;
