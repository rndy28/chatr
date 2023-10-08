export type Position = "left" | "right";

export interface IMessage {
  uuid: string;
  from: {
    username: string;
    profile: null | string;
    status: "Playing chatr" | string;
  };
  to: {
    username: string;
    profile: null | string;
    status: "Playing chatr" | string;
  };
  text: string;
  isRead: boolean;
  sent: number;
  unreadMessages: number;
}

export interface IUser {
  username: string;
  profile: string | null;
  status: string;
}

export type Size = "sm" | "md" | "lg";
export type Variant = "primary" | "secondary" | "neutral";
