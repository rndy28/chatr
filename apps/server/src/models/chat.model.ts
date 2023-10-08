import mongoose, { Schema } from "mongoose";

export interface IChatInput {
  uuid: string;
  from: string;
  to: string;
  text: string;
  isRead: boolean;
  sent: number;
}

export interface IChat extends mongoose.Document, IChatInput {}

const ChatSchema: Schema = new Schema({
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

export default mongoose.model<IChat>("Chat", ChatSchema);
