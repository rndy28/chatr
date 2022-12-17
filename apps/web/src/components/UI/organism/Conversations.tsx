import { getUsers } from "api";
import Loader from "components/UI/atoms/Loader";
import Conversation from "components/UI/molecules/Conversation";
import { useSocket } from "libs/contexts/SocketContext";
import { ISender, IUser } from "libs/types";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const { data: response, status, isRefetching } = useQuery(["users"], getUsers);
  const queryClient = useQueryClient();

  const onConversation = (contact: IUser) => () => {
    setConversation(contact);
  };

  //! perf problem: everytime theres a message comming in, client will refetching users again (imagine if we have 10000 users)
  //! possible solution: send user data along with message from backend

  //! this will introduce another problem, because payload will be objected, due to user data addition

  useEffect(() => {
    if (messages.length === 0) return;
    if (status === "success") {
      setUsers((prev) => (JSON.stringify(prev) === JSON.stringify(response) ? prev : response.data));
    }
  }, [onlineUsers, messages, status, isRefetching]);

  useEffect(() => {
    setSenders(
      messages.reduce((acc, message, _, arr) => {
        const sender = users.find((user) => user.username === message.from || user.username === message.to);
        if (!sender) return acc;

        const exist = acc.find((c) => c.from === sender.username);
        if (!exist) {
          const senderMessage = arr.filter((m) => m.from === sender.username || m.to === sender.username);
          acc.push({
            from: sender.username,
            profile: sender.profile,
            status: sender.status,
            text: senderMessage.map((sender) => sender.text)[senderMessage.length - 1],
            sent: senderMessage.map((sender) => sender.sent)[senderMessage.length - 1],
            messageLength: newMessages.filter((message) => message.from === sender.username && !message.isRead).length,
          });
        }

        return acc;
      }, [] as ISender[])
    );

    return () => {
      setSenders([]);
    };
  }, [messages, newMessages, users]);

  useEffect(() => {
    queryClient.invalidateQueries(["users"]);
  }, [messages]);

  const filteredSenders = senders.filter(
    (sender) =>
      sender.from.toLowerCase().includes(query.toLowerCase()) || sender.text.toLowerCase().includes(query.toLowerCase())
  );

  if (status === "loading") {
    return (
      <Container>
        <Loader size="md" />
      </Container>
    );
  }

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
