import Layout from "components/templates/Layout";
import State from "components/templates/State";
import Main from "components/UI/organism/Main";
import Sidebar from "components/UI/organism/Sidebar";
import { AnimatePresence } from "framer-motion";
import { IUser } from "libs/types";
import { useCallback, useState } from "react";

const Home = () => {
  const [conversationWith, setConversationWith] = useState<IUser | undefined>();

  const setConversation = useCallback(
    (user: IUser) => {
      setConversationWith(user);
    },
    [conversationWith],
  );

  const clearConversation = useCallback(() => {
    setConversationWith(undefined);
  }, [conversationWith]);

  return (
    <Layout>
      <Sidebar
        setConversation={setConversation}
        conversationWith={conversationWith}
      />
      <AnimatePresence>
        {conversationWith && (
          <Main
            conversationWith={conversationWith}
            clearConversation={clearConversation}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!conversationWith && (
          <State
            title="Chatr"
            description="Start chatting with your friends"
            key="state"
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Home;
