import Profile from "components/UI/atoms/Profile";
import { ellipsis, Flex } from "components/UI/atoms/shared";
import { ASSETS_PATH } from "libs/constants";
import { ISender } from "libs/types";
import React from "react";
import ReactTimeAgo from "react-time-ago";
import styled from "styled-components";

const Container = styled.li`
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
  max-width: inherit;
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

interface Props extends React.ComponentPropsWithoutRef<"li">, ISender {}

const Conversation = ({
  from,
  profile,
  messageLength,
  text,
  sent,
  ...props
}: Props) => {
  const date = new Date(sent * 1000);
  return (
    <Container {...props}>
      {profile ? (
        <Profile picture={ASSETS_PATH + profile} size="md" />
      ) : (
        <Profile size="md" />
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
          {messageLength > 0 && (
            <MessageLength length={messageLength}>
              {messageLength}
            </MessageLength>
          )}
        </Flex>
      </Flex>
    </Container>
  );
};

export default Conversation;
