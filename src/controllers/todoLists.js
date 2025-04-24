import { UsersCollection } from "../models/user.js";
import { TodoListsCollection } from "../models/todoList.js";
import createHttpError from "http-errors";

export const getAllTodoListsController = async (req, res) => {
  const todoLists = await TodoListsCollection.find({ userId: req.user._id });
  const mapped = todoLists.map((item) => ({
    ...item.toObject(),
    id: item._id.toString(), // додаємо поле id
  }));
  res.json(mapped);
};

export const createTodoListController = async (req, res) => {
  const newList = await TodoListsCollection.create({
    name: req.body.name,
    userId: req.user._id,
    participants: [
      {
        userId: req.user._id,
        role: "admin",
      },
    ],
  });
  res.status(201).json({
    ...newList.toObject(),
    id: newList._id.toString(),
  });
};
export const updateTodoListController = async (req, res) => {
  const updated = await TodoListsCollection.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { name: req.body.name },
    { new: true }
  );
  if (!updated) throw createHttpError(404, "Todo list not found");
  res.json(updated);
};

export const deleteTodoListController = async (req, res) => {
  await TodoListsCollection.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  res.status(204).send();
};

// import { TodoListsCollection } from "../models/todoList.js";
// import createHttpError from "http-errors";

// export const getAllTodoListsController = async (req, res) => {
//   const todoLists = await TodoListsCollection.find({ userId: req.user._id });
//   const mapped = todoLists.map((item) => ({
//     ...item.toObject(),
//     id: item._id.toString(), // додаємо поле id
//   }));
//   res.json(mapped);
// };

// export const createTodoListController = async (req, res) => {
//   const newList = await TodoListsCollection.create({
//     name: req.body.name,
//     userId: req.user._id,
//   });
//   res.status(201).json({
//     ...newList.toObject(),
//     id: newList._id.toString(),
//   });
// };

// export const updateTodoListController = async (req, res) => {
//   const updated = await TodoListsCollection.findOneAndUpdate(
//     { _id: req.params.id, userId: req.user._id },
//     { name: req.body.name },
//     { new: true }
//   );
//   if (!updated) throw createHttpError(404, "Todo list not found");
//   res.json(updated);
// };

// export const deleteTodoListController = async (req, res) => {
//   await TodoListsCollection.findOneAndDelete({
//     _id: req.params.id,
//     userId: req.user._id,
//   });
//   res.status(204).send();
// };

export const addParticipantToListController = async (req, res) => {
  const { id } = req.params;
  const { email, role } = req.body;
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const updatedList = await TodoListsCollection.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: {
        participants: { userId: user._id, role: role || "viewer" },
      },
    },
    { new: true }
  );

  if (!updatedList) {
    throw createHttpError(404, "Todo list not found");
  }

  res.status(200).json({
    message: "Participant added successfully",
    data: updatedList,
  });
};
