import argon2 from "argon2";
import type { FastifyReply, FastifyRequest } from "fastify";
import User from "../models/user.model";
import { signJwt } from "../utils/jwt";
import { validateAuth } from "../utils/validateAuth";

export const signup = async (
  request: FastifyRequest<{ Body: { username: string; password: string } }>,
  reply: FastifyReply
) => {
  const { username, password } = request.body;

  const error = validateAuth(username, password);

  if (error) {
    reply.status(400).send(error);
    return;
  }

  const userExist = await User.findOne({ username });

  if (userExist) {
    reply.status(400).send({
      field: "username",
      message: "username already exists",
    });
    return;
  }

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    username,
    password: hashedPassword,
    profile: null,
    contacts: [],
  });

  if (!user) {
    reply.status(400).send({
      field: "username",
      message: "unknown error",
    });
    return;
  }

  const accessToken = signJwt({ username }, { expiresIn: "30d" });

  reply.status(201).send({
    username: user.username,
    profile: user.profile,
    status: user.status,
    token: accessToken,
  });
};

export const signin = async (
  request: FastifyRequest<{ Body: { username: string; password: string } }>,
  reply: FastifyReply
) => {
  const { username, password } = request.body;
  const error = validateAuth(username, password);

  if (error) {
    reply.status(400).send(error);
    return;
  }

  const user = await User.findOne({ username });

  if (!user) {
    reply.status(404).send({ field: "username", message: "User not found" });
    return;
  }

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword) {
    reply.status(400).send({ field: "password", message: "password is invalid" });
    return;
  }

  const accessToken = signJwt({ username: user.username }, { expiresIn: "30d" });

  reply.status(200).send({
    username: user.username,
    profile: user.profile,
    status: user.status,
    token: accessToken,
  });
};
