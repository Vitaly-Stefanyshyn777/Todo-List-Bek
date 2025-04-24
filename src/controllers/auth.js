// import createHttpError from "http-errors";
// import { UsersCollection } from "../models/user.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// // import { SessionCollection } from "../models/session.js";

// export const registerUserController = async (req, res, next) => {
//   try {
//     console.log("Отримані дані для реєстрації:", req.body);

//     const existingUser = await UsersCollection.findOne({
//       email: req.body.email,
//     });
//     if (existingUser) {
//       throw createHttpError(409, "Email in use");
//     }

//     const encryptedPassword = await bcrypt.hash(req.body.password, 10);

//     // 🛡 Визначення ролі: якщо email = admin@example.com → admin, інакше → viewer
//     const role = req.body.email === "admin@example2.com" ? "admin" : "viewer";

//     const newUser = await UsersCollection.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: encryptedPassword,
//       role, // ✅ тут тепер буде або "admin", або "viewer"
//     });

//     res.status(201).json({
//       status: 201,
//       message: "Successfully registered a user!",
//       data: {
//         user: {
//           role: newUser.role,
//           email: newUser.email,
//           name: newUser.name,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Помилка реєстрації:", error);
//     next(error);
//   }
// };
// export const loginUserController = async (req, res, next) => {
//   try {
//     const user = await UsersCollection.findOne({ email: req.body.email });
//     if (!user) {
//       throw createHttpError(404, "User not found");
//     }
//     const isEqual = await bcrypt.compare(req.body.password, user.password);
//     if (!isEqual) {
//       throw createHttpError(401, "Unauthorized");
//     }

//     // JWT generation
//     const accessToken = jwt.sign(
//       { userId: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     res.json({
//       status: 200,
//       message: "Successfully logged in an user!",
//       data: {
//         accessToken,
//         user: {
//           role: user.role,
//           email: user.email,
//           name: user.name,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const logoutUserController = async (req, res, next) => {
//   try {
//     // For JWT, logout is stateless; just clear cookies if any
//     res.clearCookie("sessionId");
//     res.clearCookie("refreshToken");
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// };

// // You may implement refresh token logic here if needed

import createHttpError from "http-errors";
import { UsersCollection } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🆕 Реєстрація
export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await UsersCollection.findOne({ email });
    if (existing) throw createHttpError(409, "Email in use");

    const encrypted = await bcrypt.hash(password, 10);
    const role = email === "admin@example2.com" ? "admin" : "viewer";
    const newUser = await UsersCollection.create({
      name,
      email,
      password: encrypted,
      role,
    });

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: {
        user: { role: newUser.role, email: newUser.email, name: newUser.name },
      },
    });
  } catch (err) {
    next(err);
  }
};

// 🆕 Логаут для JWT — просто повертає 204
export const logoutUserController = async (req, res, next) => {
  try {
    // для jwt логаут статeless — нічого не зберігаємо
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// Існуючий логін
export const loginUserController = async (req, res, next) => {
  try {
    const user = await UsersCollection.findOne({ email: req.body.email });
    if (!user) throw createHttpError(404, "User not found");
    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) throw createHttpError(401, "Unauthorized");

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      status: 200,
      message: "Successfully logged in an user!",
      data: {
        accessToken,
        refreshToken,
        user: { role: user.role, email: user.email, name: user.name },
      },
    });
  } catch (err) {
    next(err);
  }
};

// Існуючий рефреш
export const refreshUserSessionController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError(400, "Refresh token required");
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await UsersCollection.findById(decoded.userId);
    if (!user) throw createHttpError(401, "User not found");

    const newAccess = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    const newRefresh = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      status: 200,
      message: "Token refreshed",
      data: { accessToken: newAccess, refreshToken: newRefresh },
    });
  } catch (err) {
    next(err);
  }
};
