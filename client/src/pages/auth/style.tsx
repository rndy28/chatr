import styled from "styled-components";

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 40rem;
`;

const Form = styled.form`
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SmallText = styled.span`
  font-size: 0.813rem;
  color: #4c566a;
  width: fit-content;
  display: block;
  margin-left: auto;
  a {
    color: inherit;
  }
`;

export { Container, Form, Group, SmallText };
