import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import styled from "styled-components";
import { getContacts } from "~/api";
import Drawer from "~/components/templates/Drawer";
import { Contact, Loader, SearchBar } from "~/components/UI";
import { REQUEST_SELECTED_CONVERSATION_CHANNEL } from "~/constants";
import { useChat } from "~/contexts/ChatContext";
import { useRoot } from "~/contexts/RootContext";
import useDebouncedQuery from "~/hooks/useDebouncedQuery";
import type { IUser } from "~/types";

const Container = styled.div`
  background-color: inherit;
  width: 100%;
  height: 12rem;
  overflow-x: hidden;
  overflow-y: auto;
`;

interface Props {
  onClose: () => void;
}

const ContactDrawer = ({ onClose }: Props) => {
  const [query, onDebouncedQuery] = useDebouncedQuery();

  const { setConversationWith, setMessages } = useChat();
  const { socket } = useRoot();

  const onConversationWithContact = (contact: IUser) => () => {
    setConversationWith(contact);
    setMessages((prev) =>
      prev.map((message) => {
        if (message.isRead) return message;

        if (message.from.username === contact.username) {
          // eslint-disable-next-line no-param-reassign
          message.isRead = !message.isRead;
          // reset unread message
          message.unreadMessages = 0;
          return message;
        }

        return message;
      })
    );
    socket.emit(REQUEST_SELECTED_CONVERSATION_CHANNEL, contact.username);
    onClose();
  };

  return (
    <Drawer title="Contact" onHide={onClose}>
      <SearchBar placeholder="search contact..." onChange={onDebouncedQuery} />
      <Suspense fallback={<Loader size="md" />}>
        <Contacts query={query} onConversationWithContact={onConversationWithContact} />
      </Suspense>
    </Drawer>
  );
};

const Contacts = ({
  query,
  onConversationWithContact,
}: {
  query: string;
  onConversationWithContact: (contact: IUser) => () => void;
}) => {
  const { data: response } = useQuery(["contacts"], getContacts, { suspense: true });

  const filteredContacts = (response?.data ?? []).filter((contact) =>
    contact.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Container>
      {filteredContacts.map((contact) => (
        <Contact
          key={contact.username}
          onClick={onConversationWithContact({
            profile: contact.profile,
            status: contact.status,
            username: contact.username,
          })}
          {...contact}
        />
      ))}
    </Container>
  );
};

export default ContactDrawer;
