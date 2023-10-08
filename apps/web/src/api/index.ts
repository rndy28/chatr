import axios, { AxiosResponse } from "axios";
import { localStorageGet } from "~/helpers";
import type { IUser } from "~/types";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_ORIGIN}/api/v1`,
});

instance.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign

  const token = localStorageGet<string>("token");

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

export const getContacts = async (): Promise<AxiosResponse<IUser[]>> => {
  try {
    const response = await instance.get("/contacts");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getUsers = async (): Promise<AxiosResponse<IUser[]>> => {
  try {
    const response = await instance.get("/users");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getChats = async () => {
  try {
    const response = await instance.get("/chats");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const signin = async (payload: Object): Promise<AxiosResponse<IUser & { token: string }>> => {
  try {
    const response = await instance.post("/auth/signin", payload);
    return response;
  } catch (error: any) {
    throw error.response;
  }
};

export const signup = async (payload: {
  username: string;
  password: string;
}): Promise<AxiosResponse<IUser & { token: string }>> => {
  try {
    const response = await instance.post("/auth/signup", payload);
    return response;
  } catch (error: any) {
    throw error.response;
  }
};

export const addContact = async (payload: { username: string }): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await instance.post("/contacts", payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const updateUser = async (payload: FormData): Promise<AxiosResponse<IUser>> => {
  try {
    const response = await instance.put("/users", payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const deleteAvatar = async (): Promise<AxiosResponse<IUser>> => {
  try {
    const response = await instance.put("users/delete", {});
    return response;
  } catch (error: any) {
    return error.response;
  }
};
