import type { FastifyInstance } from "fastify";
import { signin, signup } from "../controllers/auth.controller";

export default function auth(app: FastifyInstance) {
  app.post("/auth/signin", signin);
  app.post("/auth/signup", signup);
}
