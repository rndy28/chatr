import { getContacts } from "api";
import Drawer from "components/templates/Drawer";
import Contact from "components/UI/molecules/Contact";
import SearchBar from "components/UI/molecules/SearchBar";
import { useDebouncedQuery } from "libs/hooks/useDebouncedQuery";
import type { IUser } from "libs/types";
import { useEffect, useState } from "react";
import styled from "styled-components";

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

  const onConversationWithContact = (contact: IUser) => {
    return () => {
      setConversation(contact);
      onClose();
    };
  };

  useEffect(() => {
    (async () => {
      const { data } = await getContacts();
      setContacts(data);
    })();

    return () => {
      setContacts([]);
    };
  }, []);

  const filteredContacts = contacts.filter(contact => contact.username.toLowerCase().includes(query.toLowerCase()))

  return (
    <Drawer title="Contact" onHide={onClose}>
      <SearchBar
        placeholder="search contact..."
        cssProps="width: 90%;
              max-width: 27rem;
              margin: 1rem auto;
              @media (min-width: 900px) {
                max-width: 21rem;
              }"
        onChange={onDebouncedQuery}
      />
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
