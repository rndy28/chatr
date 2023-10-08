import mongoose, { Schema } from "mongoose";

export interface IUserInput {
  username: string;
  password: string;
  profile: string | null;
  status: string;
}

export interface IUser extends IUserInput, mongoose.Document {
  contacts: Array<Omit<IUserInput, "password">>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: String, default: null },
    status: { type: String, default: "Playing chatr" },
    contacts: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);
