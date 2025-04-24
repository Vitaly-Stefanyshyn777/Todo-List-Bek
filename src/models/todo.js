import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    todoListId: { type: Schema.Types.ObjectId, ref: "todo_lists" },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const TodosCollection = model("todos", todoSchema);
