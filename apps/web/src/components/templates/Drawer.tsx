import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import { drawerVariant } from "~/animation";
import IconMapper from "~/components/UI/atoms/IconMapper";

const Container = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 45rem;
  background-color: #fff;
  max-width: 30rem;
  @media (min-width: 768px) {
    width: 23rem;
    max-width: none;
  }
`;

const Header = styled.header`
  height: 7.5rem;
  background-color: #e5e9f0;
  color: #1a374d;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  font-weight: 500;
  font-size: 1.2rem;
  margin-left: 0.5rem;
  margin-bottom: 7px;
`;

type Props = {
  children: React.ReactNode;
  title: string;
  onHide: () => void;
};

const Drawer = ({ children, title, onHide }: Props) => (
  <Container variants={drawerVariant} initial="hidden" animate="visible" exit="exit">
    <Header>
      <IconMapper
        name="back"
        role="button"
        onClick={onHide}
        css={`
          color: inherit;
        `}
      />
      <Title>{title}</Title>
    </Header>
    {children}
  </Container>
);

export default Drawer;
