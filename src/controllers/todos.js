import { TodosCollection } from "../models/todo.js";

export const getTodosByListIdController = async (req, res) => {
  const { id } = req.params;

  const todos = await TodosCollection.find({
    todoListId: id,
    userId: req.user._id,
  });

  res.status(200).json(
    todos.map((todo) => ({
      ...todo.toObject(),
      id: todo._id.toString(),
    }))
  );
};

export const createTodoController = async (req, res) => {
  const { id: todoListId } = req.params;
  const { name, description, completed } = req.body;

  const newTodoData = {
    name,
    description,
    todoListId,
    userId: req.user._id,
  };

  if (typeof completed === "boolean") {
    newTodoData.completed = completed;
  }

  const newTodo = await TodosCollection.create(newTodoData);

  res.status(201).json({
    ...newTodo.toObject(),
    id: newTodo._id.toString(),
  });
};

export const deleteTodoController = async (req, res) => {
  const { id: todoListId, todoId } = req.params;

  const result = await TodosCollection.findOneAndDelete({
    _id: todoId,
    todoListId,
    userId: req.user._id,
  });

  if (!result) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(204).send();
};

export const updateTodoController = async (req, res) => {
  const { id: todoListId, todoId } = req.params;
  const { name, description, completed } = req.body;

  const updateFields = {
    ...(name !== undefined && { name }),
    ...(description !== undefined && { description }),
  };

  if (typeof completed === "boolean") {
    updateFields.completed = completed;
  }

  const updated = await TodosCollection.findOneAndUpdate(
    { _id: todoId, todoListId, userId: req.user._id },
    updateFields,
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Todo not found" });
  }

  res.status(200).json({
    ...updated.toObject(),
    id: updated._id.toString(),
  });
};
