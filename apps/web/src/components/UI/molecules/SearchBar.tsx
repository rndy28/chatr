import { IconSearch } from "@tabler/icons";
import React from "react";
import Input from "~/components/UI/atoms/Input";

interface Props extends Omit<React.ComponentPropsWithoutRef<"input">, "size"> {}

const SearchBar = (props: Props) => (
  <Input
    size="lg"
    variant="secondary"
    icon={{
      position: "left",
      element: (
        <IconSearch
          css={`
            color: #9aa0ac;
          `}
        />
      ),
    }}
    cssProps={`
      width: 90%;
      max-width: 27rem;
      margin: 1rem auto;
      @media (min-width: 900px) {
        max-width: 21rem;
      }
    `}
    {...props}
  />
);

export default SearchBar;
