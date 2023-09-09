import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import styled from "styled-components";
import { getUsers } from "~/api";
import { Avatar, ellipsis, Flex, Loader } from "~/components/UI/atoms";
import { ASSETS_PATH } from "~/constants";
import { useSocket } from "~/contexts/SocketContext";
import { ISender, IUser } from "~/types";

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

const From = styled.h4`
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

const Container = styled.ul`
  background-color: inherit;
  width: 100%;
  height: calc(100% - 10rem);
  overflow-x: hidden;
  overflow-y: auto;
`;

interface Props {
  setConversation: (user: IUser) => void;
  query: string;
}

const Conversations = ({ setConversation, query }: Props) => {
  const [senders, setSenders] = useState<ISender[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const { messages, newMessages, onlineUsers } = useSocket();
  const { data: response, status, isRefetching } = useQuery(["users"], getUsers);
  const queryClient = useQueryClient();

  const onConversation = (contact: IUser) => () => {
    console.log(contact);
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

const Conversation = ({
  from,
  profile,
  messageLength,
  text,
  sent,
  onClick,
}: ISender & Pick<React.ComponentPropsWithoutRef<"li">, "onClick">) => {
  const date = new Date(sent * 1000);
  return (
    <StyledConversation onClick={onClick}>
      {profile ? (
        <Avatar username={from} picture={ASSETS_PATH + profile} size="md" />
      ) : (
        <Avatar username={from} size="md" />
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
          <From>{from}</From>
          <LastMessage>{text}</LastMessage>
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
          {messageLength > 0 ? (
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
          {messageLength > 0 && <MessageLength length={messageLength}>{messageLength}</MessageLength>}
        </Flex>
      </Flex>
    </StyledConversation>
  );
};

export default Conversations;
