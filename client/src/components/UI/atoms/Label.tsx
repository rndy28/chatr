import styled from "styled-components";
import React from "react";

const Container = styled.label``;

interface Props extends React.ComponentPropsWithoutRef<"label"> {}

const Label = ({ children, ...props }: Props) => <Container {...props}>{children}</Container>;

export default Label;
