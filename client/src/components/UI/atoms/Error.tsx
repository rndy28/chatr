import styled from "styled-components";
import React from "react";

const Container = styled.span`
  font-size: 0.813rem;
  color: #da1212;
  width: fit-content;
`;

interface Props extends React.ComponentPropsWithoutRef<"span"> {}

const Error = ({ children, ...props }: Props) => <Container {...props}>{children}</Container>;

export default Error;
