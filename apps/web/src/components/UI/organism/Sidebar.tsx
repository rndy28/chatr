import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import styled from "styled-components";
import Header from "~/components/templates/Header";
import { Avatar, ellipsis, Flex, IconMapper, Menu, SearchBar } from "~/components/UI";
import { ASSETS_PATH, REQUEST_SELECTED_CONVERSATION_CHANNEL } from "~/constants";
import { useChat } from "~/contexts/ChatContext";
import { useRoot } from "~/contexts/RootContext";
import useDebouncedQuery from "~/hooks/useDebouncedQuery";
import useOutsideClick from "~/hooks/useOutsideClick";
import { IUser } from "~/types";
import ContactDrawer from "./ContactDrawer";
import ContactFormModal from "./ContactFormModal";
import ProfileDrawer from "./ProfileDrawer";

const Container = styled.aside`
  width: 100%;
  height: 100%;
  max-width: 30rem;
  & > div {
    width: 100%;
    max-width: 30rem;
    background-color: #fff;
    box-shadow: 0 0.5rem 5rem 0.5rem rgba(0, 0, 0, 0.1);
    border-right: 1px solid #e6e6e6;
    height: 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0;
    z-index: 2;
    @media (min-width: 768px) {
      width: 23rem;
      max-width: none;
      left: 0;
      transform: translateX(0);
    }
  }
`;

const StyledConversations = styled.ul`
  background-color: inherit;
  width: 100%;
  height: calc(100% - 10rem);
  overflow-x: hidden;
  overflow-y: auto;
`;

const StyledConversation = styled.li`
  display: flex;
  align-items: center;
  padding-inline: 1rem;
  min-height: 4.5rem;
  cursor: pointer;
  transition: 0.3s ease;
  & > :first-child {
    margin-right: 0.5rem;
  }
  &:hover {
    background-color: #f7f7f8;
  }
`;

const To = styled.h4`
  color: #434c5e;
  font-size: 1.1rem;
  ${ellipsis}
  max-width: 10rem;
  @media (min-width: 380px) {
    max-width: 12rem;
  }
  @media (min-width: 400px) {
    max-width: 13rem;
  }
  @media (min-width: 420px) {
    max-width: 14rem;
  }
  @media (min-width: 450px) {
    max-width: 15rem;
  }
  @media (min-width: 460px) {
    max-width: 17rem;
  }
  @media (min-width: 768px) {
    max-width: 10.5rem;
  }
`;

const LastMessage = styled.p`
  color: #999999;
  font-size: 0.813rem;
  line-height: 1.2;
  width: 100%;
  position: absolute;
  bottom: 0;
  ${ellipsis}
`;

const MessageLength = styled.span<{ length: number }>`
  background-color: #5c7aea;
  color: #fefffeff;
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 1rem;
  display: grid;
  place-items: center;
  max-width: fit-content;
  min-width: 1.5rem;
  width: 100%;
  height: 1.5rem;
  padding-top: 1px;
  padding-inline: ${(props) => props.length >= 100 && ".3rem"};
  position: relative;
  top: 3px;
`;

const Timestamp = styled.span`
  color: #999999;
  font-size: 0.813rem;
  white-space: nowrap;
`;

type Drawer = "profile" | "contact";

const Sidebar = () => {
  const [drawer, setDrawer] = useState<Drawer | undefined>();
  const [menu, setOpenMenu] = useState(false);
  const [modal, setOpenModal] = useState(false);
  const { setUser, user, socket } = useRoot();

  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    menuRef,
    useCallback((e) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("options") || target.parentElement?.classList.contains("options")) return;
      setOpenMenu(false);
    }, [])
  );

  const onToggleDrawer = (drawerName: Drawer) => () => {
    setDrawer((prev) => (prev !== drawerName ? drawerName : undefined));
  };

  const onMenuOpen = () => {
    setOpenMenu((c) => !c);
  };

  const onLogout = () => {
    localStorage.clear();
    socket.disconnect();
    setUser(null);
  };

  const onModalToggle = () => {
    setOpenModal((c) => !c);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpenModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Container>
      <div>
        <Header>
          {user!.profile ? (
            <Avatar
              username={user!.username}
              picture={ASSETS_PATH + user!.profile}
              size="md"
              onClick={onToggleDrawer("profile")}
            />
          ) : (
            <Avatar username={user!.username} size="md" onClick={onToggleDrawer("profile")} />
          )}

          <Flex
            alignItems="center"
            css={`
              color: #bbbbbb;
              position: relative;
            `}
          >
            <IconMapper name="message" role="button" onClick={onToggleDrawer("contact")} />
            <IconMapper
              name="options"
              role="button"
              className="options"
              data-testid="options-icon"
              onClick={onMenuOpen}
            />
            <AnimatePresence>
              {menu && (
                <Menu
                  menuRef={menuRef}
                  anchorPoint={{
                    x: -100,
                    y: 50,
                  }}
                >
                  <Menu.Item onClick={onModalToggle}>New Contact</Menu.Item>
                  <Menu.Item onClick={onLogout}>Logout</Menu.Item>
                </Menu>
              )}
            </AnimatePresence>
          </Flex>
        </Header>
        <Content />
        <AnimatePresence>
          {drawer === "profile" && <ProfileDrawer onClose={onToggleDrawer("profile")} />}
          {drawer === "contact" && <ContactDrawer onClose={onToggleDrawer("contact")} />}
          {modal && <ContactFormModal onModalClose={onModalToggle} />}
        </AnimatePresence>
      </div>
    </Container>
  );
};

const Content = () => {
  const { messages, setConversationWith, setMessages } = useChat();
  const { socket, user } = useRoot();
  const [query, onDebouncedQuery] = useDebouncedQuery();

  const filtered = useMemo(
    () =>
      messages.filter(
        (sender) =>
          sender.to.username.toLowerCase().includes(query.toLowerCase()) ||
          sender.text.toLowerCase().includes(query.toLowerCase())
      ),
    [query, messages]
  );

  const onConversation = (contact: IUser) => () => {
    setConversationWith(contact);

    setMessages((prev) =>
      prev.map((message) => {
        if (message.isRead) return message;

        if (message.from.username === contact.username || message.to.username === contact.username) {
          const updatedMessage = {
            ...message,
            isRead: true,
            unreadMessages: 0,
          };

          return updatedMessage;
        }

        return message;
      })
    );
    socket.emit(REQUEST_SELECTED_CONVERSATION_CHANNEL, contact.username);
  };

  return (
    <>
      <SearchBar placeholder="Search here..." onChange={onDebouncedQuery} />
      <StyledConversations>
        {filtered
          .sort((a, b) => b.sent - a.sent)
          .map((message) => {
            const date = new Date(message.sent * 1000);
            /**
             * this need to reversed
             * in order to display user data correctly on user device
             */
            const receiver = user?.username === message.to.username ? message.from : message.to;

            return (
              <StyledConversation
                onClick={onConversation({
                  username: receiver.username,
                  profile: receiver?.profile,
                  status: receiver.status,
                })}
                key={message.uuid}
              >
                {receiver?.profile ? (
                  <Avatar username={receiver.username} picture={ASSETS_PATH + receiver.profile} size="md" />
                ) : (
                  <Avatar username={receiver.username} size="md" />
                )}
                <Flex
                  justifyContent="space-between"
                  css={`
                    flex: 80%;
                  `}
                >
                  <Flex
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    gap={0.2}
                    css={`
                      flex: 100%;
                      position: relative;
                      min-height: 2.5rem;
                    `}
                  >
                    <To>{receiver.username}</To>
                    <LastMessage>{message.text}</LastMessage>
                  </Flex>
                  <Flex
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-end"
                    gap={0.3}
                    css={`
                      flex: 30%;
                    `}
                  >
                    {message.unreadMessages > 0 ? (
                      <Timestamp>
                        <ReactTimeAgo date={date} />
                      </Timestamp>
                    ) : (
                      <Timestamp
                        css={`
                          position: relative;
                          bottom: 10px;
                        `}
                      >
                        <ReactTimeAgo date={date} />
                      </Timestamp>
                    )}
                    {message.unreadMessages > 0 && (
                      <MessageLength length={message.unreadMessages}>{message.unreadMessages}</MessageLength>
                    )}
                  </Flex>
                </Flex>
              </StyledConversation>
            );
          })}
      </StyledConversations>
    </>
  );
};

export default Sidebar;
