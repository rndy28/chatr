import styled from "styled-components";
import { forwardRef, memo } from "react";
import Message from "components/UI/atoms/Message";
import { IUser, MessageT } from "libs/types";

const Container = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding: 2rem 1rem;
  background-color: #eceff4;
  flex-grow: 1;
`;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
  messages: MessageT[];
  conversationWith: IUser;
}

const Messages = forwardRef<HTMLDivElement, Props>(
  ({ messages, conversationWith, ...props }, ref) => {
    return (
      <Container ref={ref} {...props}>
        {messages.map(({ from, text, sent }, idx) => (
          <Message
            key={idx}
            type={conversationWith.username === from ? "in" : "out"}
            sent={sent}
            text={text}
          />
        ))}
      </Container>
    );
  }
);

const memoMessage = memo(Messages);

export default memoMessage;
