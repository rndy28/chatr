import type { FastifyRequest } from "fastify";
import User, { IUserInput } from "../models/user.model";
import type { FastifyReplyWithLocals } from "../types";

export const updateUser = async (
  request: FastifyRequest<{ Body: Partial<Pick<IUserInput, "username" | "status">> }> & {
    file?: any;
  },
  reply: FastifyReplyWithLocals
) => {
  const user = await User.findOne({ username: reply.locals?.username });

  if (!user) {
    reply.status(404).send({ field: "username", message: "User not found" });
    return;
  }

  const { username, status } = request.body;

  if (username) {
    user.username = username;
  }

  if (status) {
    user.status = status;
  }

  if (request.file) {
    user.profile = request.file.filename;
  }

  await user.save();

  reply.status(200).send({
    username: user.username,
    profile: user.profile,
    status: user.status,
  });
};

export const deleteAvatar = async (_request: FastifyRequest, reply: FastifyReplyWithLocals) => {
  const user = await User.findOne({ username: reply.locals?.username });

  if (!user) {
    reply.status(404).send({ field: "username", message: "User who made request not found" });

    return;
  }

  user.profile = null;

  await user.save();

  reply.status(200).send({
    username: user.username,
    profile: user.profile,
    about: user.status,
  });
};

export const getUsers = async (_request: FastifyRequest, reply: FastifyReplyWithLocals) => {
  const users = (await User.find({
    username: {
      $ne: reply.locals?.username,
    },
  })
    .select("username profile status")
    .sort({ createdAt: -1 })) as IUserInput[];

  reply.status(200).send(users);
};
