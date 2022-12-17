import { IconSearch } from "@tabler/icons";
import Input from "components/UI/atoms/Input";
import { CSSProp } from "styled-components";
import React from "react";

interface Props extends React.ComponentPropsWithoutRef<"input"> {
  cssProps?: CSSProp<any>;
}

const SearchBar = (props: Props) => (
  <Input
    elementSize="lg"
    variant="secondary"
    withIcon={{
      position: "left",
    }}
    {...props}
  >
    <IconSearch
      css={`
        color: #9aa0ac;
      `}
    />
  </Input>
);

export default SearchBar;
