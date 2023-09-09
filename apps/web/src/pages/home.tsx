import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import Header from "~/components/templates/Header";
import Layout from "~/components/templates/Layout";
import State from "~/components/templates/State";
import Sidebar from "~/components/UI/organism/Sidebar";
import { IUser } from "~/types";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import { Avatar, Flex, IconMapper, SendButton, Textbox, Message } from "~/components/UI";
import { mainVariant } from "~/animation";
import { ASSETS_PATH } from "~/constants";
import { useSocket } from "~/contexts/SocketContext";
import { useUser } from "~/contexts/UserContext";

const Container = styled(motion.main)`
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  z-index: 3;
  width: 100%;
  max-width: 30rem;
  @media (min-width: 768px) {
    max-width: none;
    position: relative;
  }
`;

const Messages = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  padding: 2rem 1rem;
  background-color: #eceff4;
  flex-grow: 1;
  position: relative;
  z-index: -1;
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

const Home = () => {
  const [conversationWith, setConversationWith] = useState<IUser | undefined>();

  const setConversation = useCallback(
    (user: IUser) => {
      setConversationWith(user);
    },
    [conversationWith]
  );

  const clearConversation = useCallback(() => {
    setConversationWith(undefined);
  }, [conversationWith]);

  return (
    <Layout>
      <Sidebar setConversation={setConversation} conversationWith={conversationWith} />
      <AnimatePresence>
        {conversationWith ? (
          <Main conversationWith={conversationWith} clearConversation={clearConversation} />
        ) : (
          <State title="Chatr" description="Start chatting with your friends" key="empty-state" />
        )}
      </AnimatePresence>
    </Layout>
  );
};

const Main = ({ conversationWith, clearConversation }: { conversationWith: IUser; clearConversation: () => void }) => {
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
    dispatchMessages({
      type: "ADD_MESSAGE",
      payload,
    });
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
    if (inputRef.current && window.innerWidth >= 950) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.textContent = "";
    }
    setValue("");
    if (messagesRef.current) {
      messagesRef.current.scroll({
        top: messagesRef.current.scrollHeight,
        behavior: conversationWith ? "auto" : "smooth",
      });
    }
  }, [messages, conversationWith]);

  return (
    <Container variants={mainVariant} initial="hidden" animate="visible" exit="hidden">
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
            <Avatar username={conversationWith.username} picture={ASSETS_PATH + conversationWith.profile} size="md" />
          ) : (
            <Avatar username={conversationWith.username} size="md" />
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
      <Messages ref={messagesRef}>
        {messages
          .filter((message) => message.to === conversationWith.username || message.from === conversationWith.username)
          .map(({ from, text, sent }) => (
            <Message key={sent} type={conversationWith.username === from ? "in" : "out"} sent={sent} text={text} />
          ))}
      </Messages>
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

export default Home;
