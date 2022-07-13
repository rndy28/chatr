import Button from "components/UI/atoms/Button";
import { IconSend } from "@tabler/icons";

const SendButton = () => {
  return (
    <Button
      type="submit"
      size="lg"
      variant="secondary"
      css={`
        border-radius: 50%;
        & svg {
          position: relative;
          right: 1px;
        }
      `}
    >
      <IconSend />
    </Button>
  );
};

export default SendButton;
