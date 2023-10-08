/* eslint-disable @typescript-eslint/no-floating-promises */
import type { FastifyInstance } from "fastify";
import Redis from "ioredis";
import {
  CONVERSATION_CHANNEL,
  MESSAGES_CHANNEL,
  NEW_MESSAGE_CHANNEL,
  ONLINE_USER_CHANNEL,
  UPDATE_MESSAGE_CHANNEL,
  REQUEST_SELECTED_CONVERSATION,
  UPSTASH_REDIS_REST_URL,
} from "./constants";
import Chat, { type IChatInput } from "./models/chat.model";
import { ISocket } from "./types/socket";
import { verifyJwt } from "./utils/jwt";

export default async function socket(app: FastifyInstance) {
  if (!UPSTASH_REDIS_REST_URL) {
    console.error("missing UPSTASH_REDIS_REST_URL");
    process.exit(1);
  }

  const publisher = new Redis(UPSTASH_REDIS_REST_URL);
  const subscriber = new Redis(UPSTASH_REDIS_REST_URL);
  const users: string[] = [];

  app.io.use((socket: ISocket, next) => {
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

  app.io.on("connection", async (socket: ISocket) => {
    if (!socket.user) return;

    const user = socket.user.username as string;

    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [{ from: user }, { to: user }],
        },
      },
      {
        $sort: { sent: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$from", user] },
              then: "$to",
              else: "$from",
            },
          },
          latestMessage: { $first: "$$ROOT" },
          unreadMessages: {
            $sum: {
              $cond: {
                if: {
                  $and: [{ $eq: ["$isRead", false] }, { $not: { $eq: ["$from", user] } }],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.to",
          foreignField: "username",
          as: "receiver",
        },
      },
      {
        $unwind: "$receiver",
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.from",
          foreignField: "username",
          as: "sender",
        },
      },
      {
        $unwind: "$sender",
      },
      {
        $replaceWith: {
          $mergeObjects: [
            "$latestMessage",
            {
              unreadMessages: "$unreadMessages",
              from: {
                username: "$sender.username",
                profile: "$sender.profile",
                status: "$sender.status",
              },
              to: {
                username: "$receiver.username",
                profile: "$receiver.profile",
                status: "$receiver.status",
              },
            },
          ],
        },
      },
      {
        $project: {
          __v: 0,
          _id: 0,
        },
      },
      {
        $sort: { sent: -1 },
      },
    ]);

    /** create room based on current user */
    socket.join(user);

    /** send messages to all user */
    await publisher.publish(MESSAGES_CHANNEL, JSON.stringify({ to: user, messages: chats }));

    /** send online user if there's any */
    const onlineUser = users.includes(user);

    await publisher.publish(ONLINE_USER_CHANNEL, String(onlineUser));

    socket.on(REQUEST_SELECTED_CONVERSATION, async (conversationWith: string) => {
      const page = 1;
      const pageSize = 10;

      const [conversations] = await Promise.all([
        Chat.aggregate([
          {
            $match: {
              $or: [
                {
                  $and: [{ from: conversationWith }, { to: user }],
                },
                {
                  $and: [{ to: conversationWith }, { from: user }],
                },
              ],
            },
          },
          // TODO implement pagination
          // { $sort: { sent: -1 } },
          // {
          //   $skip: (page - 1) * pageSize, // Calculate the number of documents to skip
          // },
          // {
          //   $limit: pageSize, // Limit the number of documents per page
          // },
          {
            $lookup: {
              from: "users",
              localField: "from",
              foreignField: "username",
              as: "sender",
            },
          },
          {
            $unwind: "$sender",
          },
          {
            $lookup: {
              from: "users",
              localField: "to",
              foreignField: "username",
              as: "receiver",
            },
          },
          {
            $unwind: "$receiver",
          },
          {
            $project: {
              _id: 0,
              uuid: 1,
              text: 1,
              sent: 1,
              from: {
                username: "$sender.username",
                profile: "$sender.profile",
                status: "$sender.status",
              },
              to: {
                username: "$receiver.username",
                profile: "$receiver.profile",
                status: "$receiver.status",
              },
              isRead: 1,
            },
          },
          { $sort: { sent: 1 } },
        ]),
        // read chat `from` the selected person
        Chat.updateMany({ $or: [{ from: conversationWith }] }, { isRead: true }),
      ]);

      await publisher.publish(CONVERSATION_CHANNEL, JSON.stringify({ to: user, conversations }));

      const onlineUser = users.includes(conversationWith);

      await publisher.publish(ONLINE_USER_CHANNEL, String(onlineUser));
    });

    socket.on(NEW_MESSAGE_CHANNEL, async (message: Omit<IChatInput, "uuid">) => {
      await publisher.publish(NEW_MESSAGE_CHANNEL, JSON.stringify(message));
    });

    socket.on(UPDATE_MESSAGE_CHANNEL, async (uuid: string) => {
      await publisher.publish(UPDATE_MESSAGE_CHANNEL, uuid);
    });

    socket.on("disconnect", async () => {
      users.splice(users.indexOf(user), 1);

      const onlineUser = users.includes(user);

      await publisher.publish(ONLINE_USER_CHANNEL, String(onlineUser));
    });
  });

  subscriber.subscribe(
    MESSAGES_CHANNEL,
    NEW_MESSAGE_CHANNEL,
    UPDATE_MESSAGE_CHANNEL,
    ONLINE_USER_CHANNEL,
    CONVERSATION_CHANNEL,
    (err, count) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Subscribed successfully! This client is currently subscribed to ${count} channels.`);
    }
  );

  subscriber.on("message", async (channel, payload) => {
    switch (channel) {
      case MESSAGES_CHANNEL: {
        /** sending all related chats to client sender */
        const deserialized = JSON.parse(payload);
        app.io.to(deserialized.to).emit(MESSAGES_CHANNEL, deserialized.messages);
        break;
      }

      case NEW_MESSAGE_CHANNEL: {
        const deserialized = JSON.parse(payload);
        try {
          await Chat.create({
            from: deserialized.from.username,
            to: deserialized.to.username,
            uuid: deserialized.uuid,
            text: deserialized.text,
            isRead: deserialized.isRead,
            sent: deserialized.sent,
          });

          const results = await Chat.aggregate([
            {
              $match: {
                to: deserialized.to.username,
                isRead: false,
              },
            },
            {
              $group: {
                _id: null,
                unreadMessages: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0, // Exclude the _id field from the result
                unreadMessages: 1,
              },
            },
          ]);

          /** send to the sender and receiver client */
          app.io
            .to(deserialized.to.username)
            .emit(NEW_MESSAGE_CHANNEL, { ...deserialized, unreadMessages: results[0]?.unreadMessages });

          app.io.to(deserialized.from.username).emit(NEW_MESSAGE_CHANNEL, deserialized);
        } catch (err) {
          console.log(err);
        }

        break;
      }

      case ONLINE_USER_CHANNEL: {
        const deserialized = JSON.parse(payload);
        /** sending users who are online to all client that connected */
        app.io.emit(ONLINE_USER_CHANNEL, deserialized);
        break;
      }

      case CONVERSATION_CHANNEL: {
        const deserialized = JSON.parse(payload);
        /** sending all conversations related between two user */
        app.io.to(deserialized.to).emit(CONVERSATION_CHANNEL, deserialized.conversations);
        break;
      }

      case UPDATE_MESSAGE_CHANNEL:
        await Chat.updateOne({ uuid: payload }, { isRead: true });
        break;
    }
  });
}
