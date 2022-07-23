import React from "react";
import styled from "styled-components";

const Container = styled.header`
  position: sticky;
  top: 0;
  min-height: 4.5rem;
  width: 100%;
  padding-inline: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ebebeb;
  background-color: inherit;
`;

interface Props extends React.ComponentPropsWithoutRef<"header"> {}

const Header = ({ children, ...props }: Props) => <Container {...props}>{children}</Container>;

export default Header;
