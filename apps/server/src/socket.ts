/* eslint-disable @typescript-eslint/no-floating-promises */
import { Server } from "socket.io";
import { ISocket } from "./types/socket";
import { verifyJwt } from "./utils/jwt";
import Chats, { IChats } from "./models/chats.model";

const users = [] as string[];

function socket({ io }: { io: Server }) {
  io.use((socket: ISocket, next: Function) => {
    const token = socket.handshake.auth.token as string;

    if (!token) return next(new Error("No token provided"));

    const { payload } = verifyJwt(token);

    if (!payload) return next(new Error("Invalid token"));
    if (typeof payload === "string" || !payload) return next();

    socket.user = payload;

    if (!users.includes(payload.username)) {
      users.push(payload.username);
    }
    next();
  });

  io.on("connection", async (socket: ISocket) => {
    if (!socket.user) return;

    const user = socket.user.username;

    // getting all chats
    const chats = await Chats.find({ $or: [{ from: user }, { to: user }] });

    socket.join(user);

    // sending all chats to client
    socket.emit("messages", chats);

    // sending users who are online to all client that connected
    io.emit("online-users", users);

    socket.on("message", async (message: { text: string; to: string; from: string; isRead: boolean; sent: number }) => {
      socket.to(message.to).to(message.from).emit("message", message); // send to the specific client
      Chats.create(message);
    });

    socket.on("updated-messages", async (messages: IChats[] | undefined) => {
      if (messages && messages.length > 0) {
        await Chats.updateMany({ uuid: { $in: messages.map((message) => message.uuid) } }, { isRead: true });
      }
    });

    socket.on("disconnect", () => {
      users.splice(users.indexOf(user), 1);
      io.emit("online-users", users);
    });
  });
}

export default socket;
