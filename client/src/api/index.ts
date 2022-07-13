import axios, { AxiosResponse } from "axios";
import { localStorageGet } from "libs/helpers";
import type { IUser } from "libs/types";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_ORIGIN}/api/`,
});

instance.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${localStorageGet<string>("token")}`,
  };

  return config;
});

export const getContacts = async (): Promise<AxiosResponse<IUser[]>> => {
  try {
    const response = await instance.get("users/contacts");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getUsers = async (): Promise<AxiosResponse<IUser[]>> => {
  try {
    const response = await instance.get("users");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getChats = async () => {
  try {
    const response = await instance.get("chats");
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const signin = async (
  payload: Object
): Promise<AxiosResponse<IUser & { token: string }>> => {
  try {
    const response = await instance.post("auth/signin", payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const signup = async (payload: {
  username: string;
  password: string;
}): Promise<AxiosResponse<IUser & { token: string }>> => {
  try {
    const response = await instance.post("auth/signup", payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const addContact = async (payload: {
  username: string;
}): Promise<AxiosResponse<IUser>> => {
  try {
    const response = await instance.post("users/add-contact", payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const updateUserProfile = async (
  payload: FormData
): Promise<AxiosResponse<IUser>> => {
  try {
    const response = await instance.patch("users/profile", payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const deleteUserProfilePicture = async (): Promise<
  AxiosResponse<IUser>
> => {
  try {
    const response = await instance.patch("users/profile/delete", {});
    return response;
  } catch (error: any) {
    return error.response;
  }
};
