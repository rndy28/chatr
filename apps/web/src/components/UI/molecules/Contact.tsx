import React from "react";
import styled from "styled-components";
import { Avatar, ellipsis, Flex } from "~/components/UI/atoms";
import { ASSETS_PATH } from "~/constants";
import { IUser } from "~/types";

const Container = styled.li`
  display: flex;
  align-items: center;
  padding-inline: 1rem;
  height: 4.5rem;
  cursor: pointer;
  transition: 0.3s ease;
  & > :first-child {
    margin-right: 0.5rem;
  }
  &:hover {
    background-color: #f7f7f8;
  }
`;

const Title = styled.h4`
  color: #434c5e;
  font-size: 1.1rem;
  ${ellipsis}
  max-width: inherit;
`;

const Status = styled.span`
  color: #999999;
  font-size: 0.813rem;
  line-height: 1.2;
  ${ellipsis}
  max-width: 14.5rem;
`;

interface Props extends React.ComponentPropsWithoutRef<"li">, IUser {}

const Contact = ({ status, profile, username, ...props }: Props) => (
  <Container {...props}>
    {profile ? (
      <Avatar username={username} picture={ASSETS_PATH + profile} size="lg" />
    ) : (
      <Avatar username={username} size="lg" />
    )}
    <Flex
      direction="column"
      justifyContent="center"
      css={`
        position: relative;
        top: 2px;
      `}
    >
      <Title>{username}</Title>
      <Status>{status}</Status>
    </Flex>
  </Container>
);

export default Contact;
