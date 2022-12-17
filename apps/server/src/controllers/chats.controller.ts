import { Request, Response } from "express";
import Chats from "../models/chats.model";

export const getChats = async (_req: Request, res: Response<{}, { username: string }>) => {
  const chats = await Chats.find({ to: res.locals.username });

  return res.status(200).send({ chats });
};

export const getOneToOneChats = async (_req: Request, res: Response<{}, { username: string }>) => {
  const chats = await Chats.find({ from: res.locals.username });

  return res.status(200).send({ chats });
};
