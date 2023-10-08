import ReactTimeAgo from "react-time-ago";
import styled from "styled-components";

type MessageType = "in" | "out";

const Container = styled.div<{ type: MessageType }>`
  margin-left: ${({ type }) => (type === "in" ? "0" : "auto")};
  position: relative;
  width: fit-content;
  min-width: 7rem;
  & + & {
    margin-top: 3rem;
  }
`;

const Text = styled.div<{ type: MessageType }>`
  font-size: 0.913rem;
  background-color: ${({ type }) => (type === "in" ? "#4C566A" : "#fff")};
  color: ${({ type }) => (type === "in" ? "#fff" : "#2E3440")};
  border-radius: 0.4rem;
  min-height: 0.8rem;
  width: fit-content;
  min-width: inherit;
  max-width: 18rem;
  display: flex;
  align-items: center;
  padding: 0.7rem;
  word-break: break-all;
  position: relative;
`;

const Meta = styled.span<{ type: MessageType }>`
  font-size: 12px;
  position: absolute;
  top: -1.3rem;
  ${({ type }) => (type === "in" ? "right: 0;" : "left: 0;")};
  width: fit-content;
  height: fit-content;
  color: #434c5e;
`;

const Check = styled.span<{ isRead: boolean }>`
  position: absolute;
  bottom: 0px;
  right: 8px;
  color: ${({ isRead }) => (isRead ? "#5e9fee" : "#777777")};
`;

interface Props {
  type: MessageType;
  text: string;
  sent: number;
  isRead: boolean;
}

const Message = ({ text, type, sent, isRead }: Props) => {
  const date = new Date(sent * 1000);
  return (
    <Container type={type}>
      <Text type={type}>
        {text}
        {/* Implement message is read indicator */}
        {/* {type === "out" && (
          <Check isRead={isRead}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M7 12l5 5l10 -10"></path>
              <path d="M2 12l5 5m5 -5l5 -5"></path>
            </svg>
          </Check>
        )} */}
      </Text>
      <Meta type={type}>
        <ReactTimeAgo date={date} />
      </Meta>
    </Container>
  );
};

export default Message;
