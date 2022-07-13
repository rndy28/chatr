import Header from "components/templates/Header";
import IconMapper from "components/UI/atoms/IconMapper";
import Profile from "components/UI/atoms/Profile";
import { Flex } from "components/UI/atoms/shared";
import SendButton from "components/UI/molecules/SendButton";
import Textbox from "components/UI/molecules/Textbox";
import Messages from "components/UI/organism/Messages";
import { motion } from "framer-motion";
import { mainVariant } from "libs/animation";
import { ASSETS_PATH } from "libs/constants";
import { useSocket } from "libs/contexts/SocketContext";
import { useUser } from "libs/contexts/UserContext";
import { IUser } from "libs/types";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { v4 } from "uuid";

const Container = styled(motion.main)`
  max-height: inherit;
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  z-index: 3;
  width: 100%;
  max-width: 30rem;
  & > div {
    flex-grow: 1;
  }
  @media (min-width: 768px) {
    max-width: none;
    position: relative;
  }
`;

const Form = styled.form`
  width: 100%;
  background-color: #fff;
  display: grid;
  grid-template-columns: 1fr 3rem;
  justify-content: space-between;
  align-items: flex-end;
  padding: 1rem 1rem 1.1rem 1rem;
  gap: 1.5rem;
`;

type Props = {
  conversationWith: IUser;
  clearConversation: () => void;
};

const Main = ({ conversationWith, clearConversation }: Props) => {
  const [value, setValue] = useState("");
  const { user } = useUser();
  const { socket, dispatchMessages, onlineUsers, messages } = useSocket();
  const inputRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const onSend = () => {
    const payload = {
      uuid: v4(),
      from: user!.username,
      to: conversationWith.username,
      text: value,
      sent: Math.floor(new Date().getTime() / 1000),
      isRead: false,
    };
    dispatchMessages({ type: "ADD_MESSAGE", payload });
    socket.emit("message", payload);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && e.shiftKey) return;
    if (e.key === "Enter" && value !== "") {
      e.preventDefault();
      onSend();
    }
  };

  const onChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (typeof e.currentTarget.textContent === "string") {
      setValue(e.currentTarget.textContent);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    inputRef.current && (inputRef.current.textContent = "");
    setValue("");
    if (messagesRef.current) {
      messagesRef.current.scroll({
        top: messagesRef.current.scrollHeight,
        behavior: conversationWith ? "auto" : "smooth",
      });
    }
  }, [messages, conversationWith]);

  return (
    <Container
      variants={mainVariant}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Header
        css={`
          flex-shrink: 0;
          background-color: #fff;
        `}
      >
        <Flex>
          {window.innerWidth <= 768 && (
            <IconMapper
              name="back"
              role="button"
              className="back-btn"
              css={`
                margin-right: 0.5rem;
              `}
              onClick={clearConversation}
            />
          )}
          {conversationWith.profile ? (
            <Profile
              picture={ASSETS_PATH + conversationWith.profile}
              size="md"
            />
          ) : (
            <Profile size="md" />
          )}
          <Flex
            direction="column"
            justifyContent="center"
            css={`
              margin-left: 0.5rem;
            `}
          >
            <span>{conversationWith.username}</span>
            {onlineUsers.includes(conversationWith.username) && (
              <span
                css={`
                  font-size: 13px;
                `}
              >
                online
              </span>
            )}
          </Flex>
        </Flex>
      </Header>
      <Messages
        ref={messagesRef}
        conversationWith={conversationWith}
        messages={messages.filter(
          (message) =>
            message.to === conversationWith.username ||
            message.from === conversationWith.username
        )}
      />
      <Form onSubmit={handleSubmit}>
        <Textbox
          value={value}
          placeholder="Type a message..."
          onChange={onChange}
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
        <SendButton />
      </Form>
    </Container>
  );
};

export default Main;
