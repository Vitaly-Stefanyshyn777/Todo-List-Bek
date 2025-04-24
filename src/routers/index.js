import { Router } from "express";
import contactsRouter from "./contacts.js";
import authRouter from "./auth.js";
import quizRouter from "./quiz.js";
import usersRouter from "./users.js";
import todoListsRouter from "./todo-lists.js";
const router = Router();

router.use("/contacts", contactsRouter);
router.use("/auth", authRouter);
router.use("/quiz-results", quizRouter);
router.use("/users", usersRouter);
router.use("/todo-lists", todoListsRouter);
export default router;
