import styled from "styled-components";

const Container = styled.span`
  font-size: 0.813rem;
  color: #da1212;
  width: fit-content;
`;

interface Props extends React.ComponentPropsWithoutRef<"span"> {}

const Error = ({ children, ...props }: Props) => {
  return <Container {...props}>{children}</Container>;
};

export default Error;
