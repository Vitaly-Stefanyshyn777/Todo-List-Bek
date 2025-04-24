import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { UsersCollection } from "../models/user.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    next(createHttpError(401, "Please provide Authorization header"));
    return;
  }

  const bearer = authHeader.split(" ")[0];
  const token = authHeader.split(" ")[1];

  if (bearer !== "Bearer" || !token) {
    next(createHttpError(401, "Auth header should be of type Bearer"));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UsersCollection.findById(decoded.userId);
    if (!user) {
      next(createHttpError(401, "User not found"));
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    next(createHttpError(401, "Invalid or expired token"));
  }
};
