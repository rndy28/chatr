import type { FastifyInstance, FastifySchema } from "fastify";
import { addContact, getContacts } from "../controllers/contact.controller";
import { isAuthed } from "../middleware/isAuthed";

export default function contacts(app: FastifyInstance) {
  const schema: FastifySchema = {
    params: {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    },
  };

  app.register(
    (instance, _, done) => {
      instance.get("/", getContacts);
      instance.post("/", addContact);
      instance.put("/:id", { schema }, () => {});
      instance.delete("/:id", { schema }, () => {});
      instance.addHook("preHandler", isAuthed);
      done();
    },
    { prefix: "/contacts" }
  );
}
