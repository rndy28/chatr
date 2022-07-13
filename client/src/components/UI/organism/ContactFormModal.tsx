import Modal from "components/templates/Modal";
import Button from "components/UI/atoms/Button";
import IconMapper from "components/UI/atoms/IconMapper";
import Input from "components/UI/atoms/Input";
import Label from "components/UI/atoms/Label";
import Error from "components/UI/atoms/Error";
import { Flex } from "components/UI/atoms/shared";
import { motion } from "framer-motion";
import { formInModalVariant } from "libs/animation";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { addContact } from "api";

const Container = styled(motion.form)`
  padding: 1rem;
  min-height: 12rem;
  width: 100%;
  max-width: 25rem;
  color: #3b4252;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: 500;
`;

type Props = {
  onModalClose: () => void;
};

const ContactFormModal = ({ onModalClose }: Props) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.length === 0) return setError("username is required");
    setLoading(true);
    const { data } = await addContact({ username });

    if ("field" in data) {
      const message = data["message" as keyof typeof data] as string;
      setError(message);
    } else {
      onModalClose();
    }
    setLoading(false);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    if (username.length > 0) {
      setError("");
    }
  }, [username]);

  return (
    <Modal>
      <Container
        variants={formInModalVariant}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onSubmit={handleSubmit}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          css={`
            margin-bottom: 0.8rem;
          `}
        >
          <Title>Create new contact</Title>
          <IconMapper
            name="close"
            role="button"
            onClick={onModalClose}
            css={`
              color: inherit;
            `}
          />
        </Flex>
        <Flex
          direction="column"
          gap={0.3}
          css={`
            margin-block: 1rem;
          `}
        >
          <Label
            htmlFor="username"
            css={`
              margin-bottom: 3px;
            `}
          >
            username
          </Label>
          <Input
            id="username"
            name="username"
            aria-invalid={error ? true : false}
            aria-errormessage="username-error"
            elementSize="md"
            variant="secondary"
            onChange={onChange}
            autoFocus
          />
          {error && <Error id="username-error">{error}</Error>}
        </Flex>
        <Button
          size="md"
          variant="primary"
          loading={loading}
          css={`
            max-width: 100%;
          `}
        >
          Add to contact
        </Button>
      </Container>
    </Modal>
  );
};

export default ContactFormModal;
