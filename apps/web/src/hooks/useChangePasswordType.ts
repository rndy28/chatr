import { useState } from "react";

/**
 * @returns tuple containing input type and function to toggle input type
 */
const useChangePasswordType = (): ["text" | "password", () => void] => {
  const [passwordType, setPasswordType] = useState<"text" | "password">("password");

  const onTogglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return [passwordType, onTogglePassword];
};

export default useChangePasswordType;
