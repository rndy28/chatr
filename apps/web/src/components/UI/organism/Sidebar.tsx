import Header from "components/templates/Header";
import IconMapper from "components/UI/atoms/IconMapper";
import Profile from "components/UI/atoms/Profile";
import { Flex } from "components/UI/atoms/shared";
import Menu from "components/UI/molecules/Menu";
import SearchBar from "components/UI/molecules/SearchBar";
import ContactDrawer from "components/UI/organism/ContactDrawer";
import ContactFormModal from "components/UI/organism/ContactFormModal";
import Conversations from "components/UI/organism/Conversations";
import ProfileDrawer from "components/UI/organism/ProfileDrawer";
import { AnimatePresence } from "framer-motion";
import { ASSETS_PATH } from "libs/constants";
import { useSocket } from "libs/contexts/SocketContext";
import { useUser } from "libs/contexts/UserContext";
import useDebouncedQuery from "libs/hooks/useDebouncedQuery";
import useOutsideClick from "libs/hooks/useOutsideClick";
import { IUser } from "libs/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
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
`;

const Wrapper = styled.aside`
  width: 100%;
  height: 100%;
  max-width: 30rem;
`;

type Drawer = "profile" | "contact";

type Props = {
  setConversation: (user: IUser) => void;
  conversationWith?: IUser;
};

const Sidebar = ({ setConversation, conversationWith }: Props) => {
  const [drawer, setDrawer] = useState<Drawer | undefined>();
  const [menu, setOpenMenu] = useState(false);
  const [modal, setOpenModal] = useState(false);
  const { setUser, user } = useUser();
  const { messages, newMessages, dispatchMessages, socket } = useSocket();
  const [query, onDebouncedQuery] = useDebouncedQuery();
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useOutsideClick(
    menuRef,
    useCallback(
      (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains("options") || target.parentElement?.classList.contains("options")) return;
        setOpenMenu(false);
      },
      [menuRef]
    )
  );

  const onToggleDrawer = (drawerName: Drawer) => () => {
    setDrawer((prev) => (prev !== drawerName ? drawerName : undefined));
  };

  const onMenuOpen = () => {
    setOpenMenu((c) => !c);
  };

  const onLogout = () => {
    setUser(undefined);
    dispatchMessages({
      type: "RESET_MESSAGES",
    });
    localStorage.clear();
    socket.disconnect();
    navigate("/signin");
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

  useEffect(() => {
    dispatchMessages({
      type: "SET_READ_MESSAGES",
      payload: {
        conversationWith: conversationWith?.username,
        messages,
      },
    });
  }, [messages, conversationWith]);

  useEffect(() => {
    socket.emit(
      "updated-messages",
      messages.filter((message) => message.isRead)
    );
  }, [newMessages]);

  return (
    <Wrapper>
      <Container>
        <Header>
          {user!.profile ? (
            <Profile
              username={user!.username}
              picture={ASSETS_PATH + user!.profile}
              size="md"
              onClick={onToggleDrawer("profile")}
            />
          ) : (
            <Profile username={user!.username} size="md" onClick={onToggleDrawer("profile")} />
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
        <SearchBar
          placeholder="Search here..."
          cssProps="width: 90%;
              max-width: 27rem;
              margin: 1rem auto;
              @media (min-width: 900px) {
                max-width: 21rem;
              }"
          onChange={onDebouncedQuery}
        />
        <Conversations setConversation={setConversation} query={query} />
        <AnimatePresence>
          {drawer === "profile" && <ProfileDrawer onClose={onToggleDrawer("profile")} />}
          {drawer === "contact" && (
            <ContactDrawer onClose={onToggleDrawer("contact")} setConversation={setConversation} />
          )}
          {modal && <ContactFormModal onModalClose={onModalToggle} />}
        </AnimatePresence>
      </Container>
    </Wrapper>
  );
};

export default Sidebar;
