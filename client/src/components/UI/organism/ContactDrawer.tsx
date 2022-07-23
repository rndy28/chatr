import { getContacts } from "api";
import Drawer from "components/templates/Drawer";
import Loader from "components/UI/atoms/Loader";
import Contact from "components/UI/molecules/Contact";
import SearchBar from "components/UI/molecules/SearchBar";
import useDebouncedQuery from "libs/hooks/useDebouncedQuery";
import type { IUser } from "libs/types";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
