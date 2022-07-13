import { Request, Response } from "express";
import User, { IUserInput } from "../models/user.model";
import { signJwt } from "../utils/jwt";
import argon2 from "argon2";
import { validateAuth } from "../utils/validateAuth";

export const signup = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
) => {
  const { username, password } = req.body;

  const error = validateAuth(username, password);

  if (error) return res.status(400).send(error);

  const userExist = await User.findOne({ username });

  if (userExist) {
    return res.status(400).send({
      field: "username",
      message: "username already exists",
    });
  }

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    username: username,
    password: hashedPassword,
    profile: null,
    status: "",
    contacts: [],
  });

  if (!user) {
    return res.status(400).send({
      field: "username",
      message: "unknown error",
    });
  }

  const accessToken = signJwt(
    { username: user.username },
    { expiresIn: "30d" }
  );

  return res.status(201).send({
    username: user.username,
    profile: user.profile,
    status: user.status,
    token: accessToken,
  });
};

export const signin = async (
  req: Request<{}, {}, { username: string; password: string }>,
  res: Response
) => {
  const { username, password } = req.body;
  const error = validateAuth(username, password);

  if (error) return res.status(400).send(error);

  const user = await User.findOne({ username });

  if (!user)
    return res
      .status(404)
      .send({ field: "username", message: "User not found" });

  const validPassword = await argon2.verify(user.password, password);

  if (!validPassword)
    return res
      .status(400)
      .send({ field: "password", message: "password is invalid" });

  const accessToken = signJwt(
    { username: user.username },
    { expiresIn: "30d" }
  );

  return res.status(200).send({
    username: user.username,
    profile: user.profile,
    status: user.status,
    token: accessToken,
  });
};

export const updateUser = async (
  req: Request<{}, {}, Partial<Pick<IUserInput, "username" | "status">>>,
  res: Response<{}, { username: string }>
) => {
  const user = await User.findOne({ username: res.locals.username });

  if (!user)
    return res
      .status(404)
      .send({ field: "username", message: "User not found" });

  const { username, status } = req.body;

  if (username) {
    user.username = username;
  }

  if (status) {
    user.status = status;
  }

  if (req.file) {
    user.profile = req.file.filename;
  }

  await user.save();

  res.status(200).send({
    username: user.username,
    profile: user.profile,
    status: user.status,
  });
};

export const deleteProfilePicture = async (
  _: Request,
  res: Response<{}, { username: string }>
) => {
  const user = await User.findOne({ username: res.locals.username });

  if (!user)
    return res
      .status(404)
      .send({ field: "username", message: "User who made request not found" });

  user.profile = null;
  user.save();

  res.status(200).send({
    username: user.username,
    profile: user.profile,
    about: user.status,
  });
};

export const addContact = async (
  req: Request<{}, {}, Pick<IUserInput, "username">>,
  res: Response<{}, { username: string }>
) => {
  const user = await User.findOne({ username: res.locals.username });

  if (!user)
    return res
      .status(404)
      .send({ field: "username", message: "User who made request not found" });

  const { username } = req.body;

  if (!username)
    return res
      .status(400)
      .send({ field: "username", message: "username are required" });

  if (user.contacts.find((contact) => contact.username === username))
    return res
      .status(400)
      .send({ field: "username", message: "User is already in contacts" });

  if (user.username === username)
    return res
      .status(400)
      .send({ field: "username", message: "You cannot add yourself" });

  const addedContact = await User.findOne({ username });

  if (!addedContact)
    return res
      .status(404)
      .send({ field: "username", message: "User to add as a contact is nowhere to be found" });

  user.contacts.push({
    username,
  });

  await user.save();

  res.status(200).send({ message: "Contact added" });
};

export const getUserContacts = async (
  _req: Request,
  res: Response<{}, { username: string }>
) => {
  const user = await User.findOne({ username: res.locals.username });

  if (!user) return res.status(404).send({ field: "username", message: "User not found" });

  let tempContacts: Omit<IUserInput, "password">[] = [];
 

  for (let i = 0; i < user.contacts.length; i++) {
    const contact = await User.findOne({ username: user.contacts[i].username });
    if (contact) {
      tempContacts.push({
        username: user.contacts[i].username,
        status: contact.status,
        profile: contact.profile,
      });
    }
  }

  res.status(200).send(tempContacts);
};

export const getUsers = async (
  _req: Request,
  res: Response<{}, { username: string }>
) => {
  const users = (await User.find({
    username: {
      $ne: res.locals.username,
    },
  })
    .select("username profile status")
    .sort({ createdAt: -1 })) as IUserInput[];

  res.status(200).send(users);
};
