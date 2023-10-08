import type { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import path from "path";
import { deleteAvatar, getUsers, updateUser } from "../controllers/user.controller";
import { isAuthed } from "../middleware/isAuthed";
import { IUserInput } from "../models/user.model";

export default function users(app: FastifyInstance) {
  const upload = multer({
    dest: path.join(__dirname, "../assets"),
  });

  app.register(multer.contentParser);

  app.register(
    (instance, _, done) => {
      instance.get("/", getUsers);
      instance.put<{ Body: Partial<Pick<IUserInput, "username" | "status">> }>(
        "/",
        { preHandler: upload.single("avatar") },
        updateUser
      );
      instance.delete("/", deleteAvatar);
      instance.addHook("preHandler", isAuthed);
      done();
    },
    { prefix: "/users" }
  );
}
