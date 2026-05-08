import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  role: { type: String, enum: ["user", "assistant", "system"], default: "user" },
  message: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const Chat = mongoose.model("Chat", chatSchema);
