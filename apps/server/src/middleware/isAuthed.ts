import type { FastifyRequest, HookHandlerDoneFunction } from "fastify";
import type { FastifyReplyWithLocals } from "../types";
import { verifyJwt } from "../utils/jwt";

export const isAuthed = (request: FastifyRequest, reply: FastifyReplyWithLocals, done: HookHandlerDoneFunction) => {
  const accessToken = request.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    reply.status(401).send({ message: "Unauthorized" });
    return;
  }

  const { payload } = verifyJwt(accessToken);

  if (!payload) {
    reply.status(400).send({ message: "Invalid token" });
    return;
  }

  if (typeof payload === "object") {
    reply.locals!.username = payload.username;
  }

  done();
};
