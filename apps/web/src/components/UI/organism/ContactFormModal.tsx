import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { addContact } from "~/api";
import Modal from "~/components/templates/Modal";
import { Button, Error, Flex, IconMapper, Input, Label } from "~/components/UI/atoms";
import { formInModalVariant } from "~/animation";

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
  const queryClient = useQueryClient();
  const { isLoading, mutateAsync } = useMutation(addContact, {
    onSuccess: () => {
      queryClient.invalidateQueries(["contacts"], {
        exact: true,
        refetchType: "inactive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.length === 0) {
      setError("username is required");
      return;
    }
    const { data } = await mutateAsync({
      username,
    });

    if ("field" in data) {
      const message = data["message" as keyof typeof data] as string;
      setError(message);
    } else {
      onModalClose();
    }
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
      <Container variants={formInModalVariant} initial="hidden" animate="visible" exit="hidden" onSubmit={handleSubmit}>
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
            aria-invalid={!!error}
            aria-errormessage="username-error"
            size="md"
            variant="secondary"
            onChange={onChange}
            autoFocus
          />
          {error && (
            <Error id="username-error" data-testid="username-error">
              {error}
            </Error>
          )}
        </Flex>
        <Button
          size="md"
          variant="primary"
          loading={isLoading}
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
