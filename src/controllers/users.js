import { UsersCollection } from "../models/user.js";

export const getAllUsersController = async (req, res) => {
  const users = await UsersCollection.find({}, "-password");
  res.json(users);
};
