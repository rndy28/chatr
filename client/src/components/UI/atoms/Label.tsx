import styled from "styled-components";

const Container = styled.label`
    
`;


interface Props extends React.ComponentPropsWithoutRef<"label"> {}

const Label = ({ children, ...props }: Props) => {
  return <Container {...props}>{children}</Container>;
};

export default Label;
