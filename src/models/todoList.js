import { Schema, model } from "mongoose";

const todoListSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    participants: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
        role: { type: String, enum: ["admin", "viewer"], default: "viewer" },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TodoListsCollection = model("todo_lists", todoListSchema);
