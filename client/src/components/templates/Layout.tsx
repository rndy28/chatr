import styled from "styled-components";

const Container = styled.div`
  display: grid;
  width: 100%;
  position: relative;
  height: 100vh;
  max-height: 100vh;
  place-items: center;
  background-color: #eceff4;
  @media (min-width: 768px) {
    grid-template-columns: 23rem 1fr;
    max-width: 90rem;
    margin-inline: auto;
  }
`;

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return <Container>{children}</Container>;
};

export default Layout;
