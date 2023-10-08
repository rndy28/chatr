import type { FastifyRequest } from "fastify";
import User from "../models/user.model";
import type { FastifyReplyWithLocals } from "../types";

export const addContact = async (
  request: FastifyRequest<{ Body: { username: string } }>,
  reply: FastifyReplyWithLocals
) => {
  const user = await User.findOne({ username: reply.locals?.username });

  if (!user) {
    reply.status(404).send({ field: "username", message: "User who made request not found" });

    return;
  }

  const { username } = request.body;

  if (!username) {
    reply.status(400).send({ field: "username", message: "username are required" });
    return;
  }

  const contactAlreadyExist = user.contacts.find((contact) => contact.username === username);

  if (contactAlreadyExist) {
    reply.status(400).send({ field: "username", message: "User is already in contacts" });
    return;
  }

  if (user.username === username) {
    reply.status(400).send({ field: "username", message: "You cannot add yourself" });
    return;
  }

  const addedContact = await User.findOne({ username }).select("username profile status");

  if (!addedContact) {
    reply.status(404).send({ field: "username", message: "User to add as a contact is nowhere to be found" });
    return;
  }

  user.contacts.push({
    username: addedContact.username,
    profile: addedContact.profile,
    status: addedContact.status,
  });

  await user.save();

  reply.status(200).send({ message: "Contact added" });
};

export const getContacts = async (_request: FastifyRequest, reply: FastifyReplyWithLocals) => {
  const user = await User.findOne({ username: reply.locals?.username });

  if (!user) {
    reply.status(404).send({ field: "username", message: "User not found" });

    return;
  }

  const results = await User.find(
    { contacts: { $all: user.contacts } },
    { contacts: { $slice: [0, 1] }, _id: false }
  ).select("contacts");

  reply.status(200).send(results[0]?.contacts || []);
};
