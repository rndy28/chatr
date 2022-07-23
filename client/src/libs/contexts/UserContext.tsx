import React, { useState } from "react";
import { createCtx, localStorageGet } from "libs/helpers";
import type { IUser } from "libs/types";

type UserContextT = {
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
};

const [useUser, Provider] = createCtx<UserContextT>();

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(localStorageGet<IUser | undefined>("user"));

  return (
    <Provider
      value={{
        setUser,
        user,
      }}
    >
      {children}
    </Provider>
  );
};

export { useUser, UserProvider };
