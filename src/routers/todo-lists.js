import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getAllTodoListsController,
  createTodoListController,
  updateTodoListController,
  deleteTodoListController,
} from "../controllers/todoLists.js";
import { addParticipantToListController } from "../controllers/todoLists.js";
import {
  getTodosByListIdController,
  createTodoController,
  deleteTodoController,
  updateTodoController,
} from "../controllers/todos.js";

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(getAllTodoListsController));
router.post("/", ctrlWrapper(createTodoListController));
router.patch("/:id", ctrlWrapper(updateTodoListController));
router.delete("/:id", ctrlWrapper(deleteTodoListController));

router.get("/:id/todos", ctrlWrapper(getTodosByListIdController));
router.post("/:id/todos", ctrlWrapper(createTodoController));
router.delete("/:id/todos/:todoId", ctrlWrapper(deleteTodoController));
router.patch("/:id/todos/:todoId", ctrlWrapper(updateTodoController));
router.post("/:id/participants", ctrlWrapper(addParticipantToListController));
export default router;
