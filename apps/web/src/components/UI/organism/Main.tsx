import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import { mainVariant, onlineUserVariant } from "~/animation";
import Header from "~/components/templates/Header";
import {
  ASSETS_PATH,
  CONVERSATION_CHANNEL,
  NEW_MESSAGE_CHANNEL,
  ONLINE_USER_CHANNEL,
  UPDATE_MESSAGE_CHANNEL,
} from "~/constants";
import { useChat } from "~/contexts/ChatContext";
import { useRoot } from "~/contexts/RootContext";
import type { IMessage, IUser } from "~/types";
import { Avatar, Flex, IconMapper } from "../atoms";
import { Message, SendButton, Textbox } from "../molecules";

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

type IConversation = Omit<IMessage, "unreadMessages">;

const Main = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const { socket, user } = useRoot();
  const { setConversationWith, conversationWith, setMessages } = useChat();

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const onClearConversation = () => {
    setConversationWith({} as IUser);
  };

  useEffect(() => {
    const onNewMessage = (data: IConversation) => {
      setConversations((prev) => [...prev, data]);
      setMessages((prev) =>
        prev.map((message) => {
          const messageToRead = prev.findIndex((m) => m.uuid === data.uuid);

          if (messageToRead !== -1) {
            return {
              ...prev[messageToRead],
              isRead: true,
              unreadMessages: 0,
            };
          }

          return message;
        })
      );
      // auto update `to` user message to read when he/her is in conversations page
      if (user?.username === data.to.username) {
        socket.emit(UPDATE_MESSAGE_CHANNEL, data.uuid);
      }
    };

    socket.on(CONVERSATION_CHANNEL, (data: IConversation[]) => {
      setConversations(data);
    });

    socket.on(ONLINE_USER_CHANNEL, (isOnline) => {
      setIsOnline(Boolean(isOnline));
    });

    socket.on(NEW_MESSAGE_CHANNEL, onNewMessage);
    // socket.on(UPDATE_MESSAGE_CHANNEL, onUpdateReadMessage);

    return () => {
      socket.off(CONVERSATION_CHANNEL);
      socket.off(ONLINE_USER_CHANNEL);
      /**
       * @description need to pass the reference to function also so that it doesn turn off all on new message listener
       * @link https://socket.io/how-to/use-with-react#cleanup
       */
      socket.off(NEW_MESSAGE_CHANNEL, onNewMessage);
      // socket.off(UPDATE_MESSAGE_CHANNEL, onUpdateReadMessage);
    };
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scroll({
        top: messagesRef.current.scrollHeight,
        behavior: conversationWith ? "auto" : "smooth",
      });
    }
  }, [conversations, conversationWith]);

  return (
    <Container
      variants={mainVariant}
      initial="hidden"
      animate="visible"
      exit="hidden"
      // prevent flashing message when user change conversation
      onAnimationStart={() => {
        setConversations([]);
      }}
      key={conversationWith.username}
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
              onClick={onClearConversation}
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
            <AnimatePresence>
              {isOnline && (
                <motion.span
                  css={`
                    font-size: 13px;
                  `}
                  variants={onlineUserVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key={String(isOnline)}
                >
                  online
                </motion.span>
              )}
            </AnimatePresence>
          </Flex>
        </Flex>
      </Header>
      <Messages ref={messagesRef}>
        {conversations.map(({ from, text, sent, uuid, isRead }) => (
          <Message
            key={uuid}
            type={conversationWith.username === from.username ? "in" : "out"}
            sent={sent}
            text={text}
            isRead={isRead}
          />
        ))}
      </Messages>
      <ChatBox />
    </Container>
  );
};

const ChatBox = () => {
  const [text, setText] = useState("");
  const { user, socket } = useRoot();
  const { conversationWith } = useChat();

  const inputRef = useRef<HTMLDivElement | null>(null);

  const resetMessage = () => {
    if (!inputRef.current) return;

    inputRef.current.textContent = "";
    setText("");
  };

  const onSend = () => {
    const payload = {
      uuid: v4(),
      from: user,
      to: conversationWith,
      text,
      sent: Math.floor(new Date().getTime() / 1000),
      isRead: false,
    };

    socket.emit(NEW_MESSAGE_CHANNEL, payload);

    resetMessage();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSend();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && e.shiftKey) return;
    if (e.key === "Enter" && text !== "") {
      e.preventDefault();
      onSend();
    }
  };

  const onChange = (e: React.FormEvent<HTMLDivElement>) => {
    if (typeof e.currentTarget.textContent === "string") {
      setText(e.currentTarget.textContent);
    }
  };

  useEffect(() => {
    if (inputRef.current && window.innerWidth >= 950) {
      inputRef.current.focus();
    }

    return () => {
      resetMessage();
    };
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <Textbox value={text} placeholder="Type a message..." onChange={onChange} onKeyDown={onKeyDown} ref={inputRef} />
      <SendButton />
    </Form>
  );
};

export default Main;
