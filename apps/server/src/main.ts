import fastifyCors from "@fastify/cors";
import "dotenv/config";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import connectDB from "./connectDB";
import { CORS_ORIGIN, HOST, PORT, __prod__ } from "./constants";
import auth from "./routes/auth.route";
import contacts from "./routes/contacts.route";
import users from "./routes/users.route";
import socket from "./socket";
import type { FastifyReplyWithLocals } from "./types";
import { compose } from "./utils/compose";
import fs from "fs";

async function buildServer() {
  const app = fastify({
    logger: true,
    https: __prod__
      ? null
      : {
          key: fs.readFileSync("localhost-key.pem"),
          cert: fs.readFileSync("localhost.pem"),
        },
  });

  await app.register(fastifyCors, {
    origin: CORS_ORIGIN,
  });

  await app.register(fastifyIO, {
    cors: {
      origin: CORS_ORIGIN,
    },
  });

  await app.register(
    (instance, _, done) => {
      instance.addHook("onRequest", (_, reply: FastifyReplyWithLocals, done) => {
        reply.locals = {};

        done();
      });

      instance.get("/healthcheck", () => ({ status: "ok", port: PORT }));

      compose(auth, users, contacts)(instance);

      done();
    },
    { prefix: "/api/v1" }
  );

  return app;
}

async function main() {
  const app = await buildServer();

  try {
    await connectDB();
    await socket(app);

    await app.listen({
      port: PORT,
      host: HOST,
    });

    console.log(`Server started at http://${HOST}:${PORT}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
