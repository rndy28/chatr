import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    *, *:before, *:after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Poppins', sans-serif;
        background-color: #ECEFF4;
        color: #3B4252;
        @media (min-width: 768px) {
            display: grid;
            align-items: center;
            min-height: 100vh;
        }
    }

    ::-webkit-scrollbar {
        width: 4px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background: #4C566A;
        border-radius: 10px;
    }                                         
    input, button {
        font-family: 'Poppins', sans-serif;
        border: none;
        outline: none;
    }
`;
