import type { FastifyReply } from "fastify";

export interface FastifyReplyWithLocals extends FastifyReply {
  locals?: Record<string, string | null> | null;
}
