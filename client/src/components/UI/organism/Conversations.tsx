import { getUsers } from "api";
import Conversation from "components/UI/molecules/Conversation";
import { useSocket } from "libs/contexts/SocketContext";
import { ISender, IUser } from "libs/types";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.ul`
  background-color: inherit;
  width: 100%;
  height: calc(100% - 10rem);
  overflow-x: hidden;
  overflow-y: auto;
`;

type Props = {
  setConversation: (user: IUser) => void;
  query: string;
};

const Conversations = ({ setConversation, query }: Props) => {
  const [senders, setSenders] = useState<ISender[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const { messages, newMessages, onlineUsers } = useSocket();

  const onConversation = (contact: IUser) => () => {
    setConversation(contact);
  };

  useEffect(() => {
    if (messages.length === 0) return;
    (async () => {
      const { data } = await getUsers();
      setUsers((prev) => (JSON.stringify(prev) === JSON.stringify(data) ? prev : data));
    })();
  }, [onlineUsers, messages]);

  useEffect(() => {
    setSenders(
      messages.reduce((acc, message, _, arr) => {
        const sender = users.find(
          (user) => user.username === message.from || user.username === message.to,
        );
        if (!sender) return acc;

        const exist = acc.find((c) => c.from === sender.username);
        if (!exist) {
          const senderMessage = arr.filter(
            (m) => m.from === sender.username || m.to === sender.username,
          );
          acc.push({
            from: sender.username,
            profile: sender.profile,
            status: sender.status,
            text: senderMessage.map((sender) => sender.text)[
              senderMessage.length - 1
            ],
            sent: senderMessage.map((sender) => sender.sent)[
              senderMessage.length - 1
            ],
            messageLength: newMessages.filter(
              (message) => message.from === sender.username && !message.isRead,
            ).length,
          });
        }

        return acc;
      }, [] as ISender[]),
    );

    return () => {
      setSenders([]);
    };
  }, [messages, newMessages, users]);

  const filteredSenders = senders.filter(
    (sender) => sender.from.toLowerCase().includes(query.toLowerCase())
      || sender.text.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Container>
      {filteredSenders
        .sort((a, b) => b.sent - a.sent)
        .map((sender) => (
          <Conversation
            key={sender.from}
            onClick={onConversation({
              username: sender.from,
              profile: sender.profile,
              status: sender.status,
            })}
            {...sender}
          />
        ))}
    </Container>
  );
};

export default Conversations;
