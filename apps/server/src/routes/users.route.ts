import type { FastifyInstance } from "fastify";
import multer from "fastify-multer";
import fs from "fs";
import path from "path";
import { deleteAvatar, getUsers, updateUser } from "../controllers/user.controller";
import { isAuthed } from "../middleware/isAuthed";
import { IUserInput } from "../models/user.model";

export default function users(app: FastifyInstance) {
  const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      const assets = path.join(__dirname, "../assets");
      if (!fs.existsSync(assets)) {
        fs.mkdirSync(assets);
      }
      cb(null, assets);
    },
    filename: function (_req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  const upload = multer({
    storage,
    limits: { fieldSize: 10 * 1024 * 1024 },
  });

  app.register(multer.contentParser);

  app.register(
    (instance, _, done) => {
      instance.get("/", getUsers);
      instance.put<{ Body: Partial<Pick<IUserInput, "username" | "status">> }>(
        "/",
        {
          preHandler: (req, reply, done) => {
            (upload.single("avatar") as any)(req, reply, (err: any) => {
              if (err) {
                console.log("has file:", req.hasOwnProperty("avatar"));
                // Log the error and file information
                console.error("Error occurred during file upload:", err);
                if ("file" in req && req.file) {
                  console.error("File details:", req.file);
                }
                return reply.status(500).send({ error: "File upload failed", details: err.message });
              }
              done();
            });
          },
        },
        updateUser
      );
      instance.delete("/", deleteAvatar);
      instance.addHook("preHandler", isAuthed);
      done();
    },
    { prefix: "/users" }
  );
}
