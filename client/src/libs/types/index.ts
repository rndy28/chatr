export type ErrorT = {
  type: "invalid" | "duplicate" | "empty" | "valid";
  isError: boolean;
};
export type Position = "left" | "right";

export type MessageT = {
  from: string;
  to: string;
  text: string;
  isRead: boolean;
  sent: number;
};

export interface ISender
  extends Omit<IUser, "username">,
    Omit<MessageT, "to" | "isRead"> {
  messageLength: number;
}

export interface IUser {
  username: string;
  profile: string | null;
  status: string;
}

export type Size = "sm" | "md" | "lg";
export type Variant = "primary" | "secondary" | "neutral";
