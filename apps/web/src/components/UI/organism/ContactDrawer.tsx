import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { getContacts } from "~/api";
import Drawer from "~/components/templates/Drawer";
import { Contact, Loader, SearchBar } from "~/components/UI";
import useDebouncedQuery from "~/hooks/useDebouncedQuery";
import type { IUser } from "~/types";

const Container = styled.div`
  background-color: inherit;
  width: 100%;
  height: 12rem;
  overflow-x: hidden;
  overflow-y: auto;
`;

type Props = {
  onClose: () => void;
  setConversation: (user: IUser) => void;
};

const ContactDrawer = ({ onClose, setConversation }: Props) => {
  const [contacts, setContacts] = useState<IUser[]>([]);
  const [query, onDebouncedQuery] = useDebouncedQuery();
  const { data: response, status } = useQuery(["contacts"], getContacts);

  const onConversationWithContact = (contact: IUser) => () => {
    setConversation(contact);
    onClose();
  };

  useEffect(() => {
    if (status === "success") {
      setContacts(response.data);
    }
    return () => {
      setContacts([]);
    };
  }, [status]);

  // eslint-disable-next-line max-len
  const filteredContacts = contacts.filter((contact) => contact.username.toLowerCase().includes(query.toLowerCase()));

  if (status === "loading") {
    return (
      <Drawer title="Contact" onHide={onClose}>
        <Loader size="md" />
      </Drawer>
    );
  }

  return (
    <Drawer title="Contact" onHide={onClose}>
      <SearchBar placeholder="search contact..." onChange={onDebouncedQuery} />
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
    </Drawer>
  );
};

export default ContactDrawer;
