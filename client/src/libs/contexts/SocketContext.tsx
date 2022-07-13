import { createCtx, localStorageGet } from "libs/helpers";
import { MessageT } from "libs/types";
import { useEffect, useMemo, useReducer, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  auth: {
    token: localStorageGet<string>("token"),
  },
});

const [useSocket, Provider] = createCtx<SocketContextT>({} as SocketContextT);

type SocketContextT = {
  messages: MessageT[];
  newMessages: MessageT[];
  dispatchMessages: React.Dispatch<ActionT>;
  socket: typeof socket;
  onlineUsers: string[];
};

type StateT = {
  messages: MessageT[];
  newMessages: MessageT[];
};

type ActionT =
  | {
      type: "ADD_MESSAGE";
      payload: MessageT;
    }
  | {
      type: "SET_MESSAGES";
      payload: MessageT[];
    }
  | {
      type: "SET_READ_MESSAGES";
      payload: {
        conversationWith: string | undefined;
        messages: MessageT[];
      };
    }
  | {
      type: "RESET_MESSAGES";
    };

function reducer(state: StateT, action: ActionT) {
  switch (action.type) {
    case "ADD_MESSAGE":
      if (state.messages.length === 0)
        return { ...state, messages: [action.payload] };
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_MESSAGES":
      if (state.messages.length === 0)
        return { ...state, messages: action.payload };
      return {
        ...state,
        messages: [...state.messages, ...action.payload],
      };
    case "SET_READ_MESSAGES":
      const { conversationWith, messages } = action.payload;
      if (!conversationWith)
        return {
          ...state,
          newMessages: messages.slice(),
        };
      return {
        ...state,
        newMessages: messages.map((message) => {
          if (message.isRead) return { ...message };
          if (message.from === conversationWith) {
            message.isRead = true;
            return { ...message };
          }
          return { ...message };
        }),
      };
    case "RESET_MESSAGES":
      return {
        ...state,
        messages: [],
        newMessages: [],
      };
    default:
      return state;
  }
}

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [{ messages, newMessages }, dispatchMessages] = useReducer(reducer, {
    messages: [],
    newMessages: [],
  });
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  useEffect(() => {
    const token = localStorageGet<string>("token");

    if (token) {
      socket.auth = { token };
      socket.connect();
    }
  }, []);

  const value = useMemo(
    () => ({ socket, newMessages, messages, dispatchMessages, onlineUsers }),
    [onlineUsers, messages, newMessages, socket]
  );

  useEffect(() => {
    socket.on("messages", (data: MessageT[]) => {
      dispatchMessages({ type: "SET_MESSAGES", payload: data });
    });
    socket.on("message", (message: MessageT) => {
      dispatchMessages({ type: "ADD_MESSAGE", payload: message });
    });
    socket.on("online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("message");
      socket.off("messages");
      socket.off("online-users");
    };
  }, [socket]);

  return <Provider value={value}>{children}</Provider>;
};

export { useSocket, SocketProvider };
