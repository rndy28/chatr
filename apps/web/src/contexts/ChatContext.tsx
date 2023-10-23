import { useEffect, useMemo, useState, type ComponentType } from "react";
import { MESSAGES_CHANNEL, NEW_MESSAGE_CHANNEL } from "~/constants";
import { createCtx } from "~/helpers";
import { IMessage, IUser } from "~/types";
import { useRoot } from "./RootContext";

interface IChatContext {
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  conversationWith: IUser;
  setConversationWith: React.Dispatch<React.SetStateAction<IUser>>;
}

const [useChat, Provider] = createCtx<IChatContext>();

const withChat = (Component: ComponentType<{}>) => () => {
  const { socket } = useRoot();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversationWith, setConversationWith] = useState<IUser>({} as IUser);

  const value = useMemo(
    () => ({
      messages,
      setMessages,
      setConversationWith,
      conversationWith,
    }),
    [messages, conversationWith]
  );

  useEffect(() => {
    const onNewMessage = (data: IMessage) => {
      setMessages((prev) => {
        if (prev.length === 0) {
          return [data]; // First message, so create a new conversation.
        }

        const existingConversationIdx = prev.findIndex(
          (message) =>
            (message.from.username === data.from.username && message.to.username === data.to.username) ||
            (message.from.username === data.to.username && message.to.username === data.from.username)
        );

        if (existingConversationIdx !== -1) {
          // Update the last message in the existing conversation.
          return prev.map((message, index) => {
            if (existingConversationIdx === index) {
              return {
                ...prev[existingConversationIdx],
                sent: data.sent,
                text: data.text,
                isRead: data.isRead,
                unreadMessages: data.unreadMessages,
                from: data.from,
                to: data.to,
              };
            }

            return message;
          });
        }

        // If it's a new conversation, prepend it to the array.
        return [data, ...prev];
      });
    };

    socket.on(MESSAGES_CHANNEL, (data: IMessage[]) => {
      setMessages(data);
    });

    socket.on(NEW_MESSAGE_CHANNEL, onNewMessage);

    return () => {
      socket.off(MESSAGES_CHANNEL);
      socket.off(NEW_MESSAGE_CHANNEL, onNewMessage);
    };
  }, [socket]);

  return (
    <Provider value={value}>
      <Component />
    </Provider>
  );
};

export { useChat, withChat };
