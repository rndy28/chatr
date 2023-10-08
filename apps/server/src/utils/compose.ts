import type { FastifyInstance } from "fastify";

export const compose =
  <T extends FastifyInstance>(...fns: Array<(app: T) => void>) =>
  (value: T) =>
    fns.reduceRight((acc, next) => {
      next(acc);
      return acc;
    }, value);
