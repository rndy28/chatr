import React, { useState, useMemo } from "react";
import { createCtx, localStorageGet } from "libs/helpers";
import type { IUser } from "libs/types";

interface UserContextT {
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

const [useUser, Provider] = createCtx<UserContextT>();

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(localStorageGet<IUser | undefined>("user"));

  const value = useMemo(() => ({ setUser, user }), [user]);

  return <Provider value={value}>{children}</Provider>;
};

export { useUser, UserProvider };
