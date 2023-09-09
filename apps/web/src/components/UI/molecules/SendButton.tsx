import { IconSend } from "@tabler/icons";
import Button from "~/components/UI/atoms/Button";

const SendButton = () => (
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

export default SendButton;
