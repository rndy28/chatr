import styled from 'styled-components';

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 40rem;
    /* button {
        margin-block: .5rem .8rem;
    }
    & div {
        display: flex;
        justify-content: space-between;
        & span:nth-of-type(2) {
            text-decoration: underline;
            cursor: pointer;
        }
    } */
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
`

const SmallText = styled.span`
    font-size: .813rem;
    color: #4C566A;
    width: fit-content;
    display: block;
    margin-left: auto;
    a {
        color: inherit;
    }
`;

export {
    Container,
    Form,
    Group,
    SmallText,
};