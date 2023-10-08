import styled from "styled-components";
import { Flex } from "~/components/UI/atoms/shared";

const Container = styled.div`
  max-height: inherit;
  height: inherit;
  display: grid;
  place-items: center;
  width: 100%;
`;

const Title = styled.h1`
  color: #3b4252;
  margin: 0;
  @media (min-width: 950px) {
    font-size: 3rem;
  }
  @media (min-width: 1200px) {
    font-size: 4rem;
  }
`;

const Description = styled.p`
  color: #4c566a;
  @media (min-width: 950px) {
    font-size: 1.15rem;
  }
  @media (min-width: 1200px) {
    font-size: 1.2rem;
  }
`;

interface Props {
  title: string;
  description?: string;
}

const State = ({ title, description }: Props) => (
  <Container>
    <Flex direction="column" alignItems="center">
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Flex>
  </Container>
);

export default State;
