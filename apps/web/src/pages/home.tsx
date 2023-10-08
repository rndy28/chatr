import { AnimatePresence } from "framer-motion";
import styled from "styled-components";
import State from "~/components/templates/State";
import Main from "~/components/UI/organism/Main";
import Sidebar from "~/components/UI/organism/Sidebar";
import { useChat, withChat } from "~/contexts/ChatContext";

const Container = styled.div`
  display: grid;
  width: 100%;
  position: relative;
  height: 100vh;
  place-items: center;
  background-color: #eceff4;
  @media (min-width: 768px) {
    grid-template-columns: 23rem 1fr;
    max-width: 90rem;
    margin-inline: auto;
  }
`;

const Home = () => {
  const { conversationWith } = useChat();

  return (
    <Container>
      <Sidebar />
      <AnimatePresence>
        {Object.values(conversationWith).length > 0 ? (
          <Main />
        ) : (
          <State title="Chatr" description="Start chatting with your friends" key="empty-state" />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default withChat(Home);
