import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { createCtx, localStorageGet } from "~/helpers";
import type { IUser } from "~/types";

const socket = io(import.meta.env.VITE_SERVER_ORIGIN, {
  autoConnect: false,
  auth: {
    token: localStorageGet<string>("token"),
  },
  reconnection: true,
  upgrade: true,
  transports: ["websocket", "polling"],
});

interface ISocketContext {
  socket: typeof socket;
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

const [useRoot, Provider] = createCtx<ISocketContext>();

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(localStorageGet<IUser | null>("user"));

  useEffect(() => {
    const token = localStorageGet<string>("token");

    if (token) {
      socket.auth = {
        token,
      };
      socket.connect();
    }
  }, []);

  const value = useMemo(
    () => ({
      socket,
      setUser,
      user,
    }),
    [user, socket]
  );

  return <Provider value={value}>{children}</Provider>;
};

export { useRoot, RootProvider };
