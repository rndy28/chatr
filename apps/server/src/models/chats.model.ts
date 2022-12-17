import mongoose, { Schema } from "mongoose";

export interface IChats extends mongoose.Document {
  uuid: string;
  from: string;
  to: string;
  text: string;
  isRead: boolean;
  sent: number;
}

const ChatsSchema: Schema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  text: { type: String, required: true },
  isRead: { type: Boolean, required: true },
  sent: { type: Number, required: true },
});

export default mongoose.model<IChats>("Chats", ChatsSchema);
