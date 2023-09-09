import { HTMLMotionProps, motion } from "framer-motion";
import ReactTimeAgo from "react-time-ago";
import styled from "styled-components";

type MessageType = "in" | "out";

const Container = styled(motion.div)<{ type: MessageType }>`
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
  background-color: ${({ type }) => (type === "in" ? "#fff" : "#5E81AC")};
  color: ${({ type }) => (type === "in" ? "#434C5E" : "#fff")};
  border-radius: 0.4rem;
  min-height: 0.8rem;
  width: fit-content;
  min-width: inherit;
  max-width: 18rem;
  display: flex;
  align-items: center;
  padding: 0.7rem;
  word-break: break-all;
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

interface Props extends HTMLMotionProps<"div"> {
  type: MessageType;
  text: string;
  sent: number;
}

const Message = ({ text, type, sent, ...props }: Props) => {
  const date = new Date(sent * 1000);
  return (
    <Container type={type} {...props}>
      <Text type={type}>{text}</Text>
      <Meta type={type}>
        <ReactTimeAgo date={date} />
      </Meta>
    </Container>
  );
};

export default Message;
