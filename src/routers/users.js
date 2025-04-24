import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getAllUsersController } from "../controllers/users.js";

const router = Router();

router.get("/", ctrlWrapper(getAllUsersController));

export default router;
