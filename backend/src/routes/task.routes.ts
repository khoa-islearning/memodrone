import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getDueTasks,
  getTask,
  scheduleTask,
  updateTask,
} from "../controllers/taskController";

const router = Router();

router.post("/", createTask);
router.get("/", getAllTasks);
router.get("/due", getDueTasks);
router.get("/:id", getTask);
router.put("/:id", updateTask);
router.put("/:id/rate", scheduleTask);
router.delete("/:id", deleteTask);

export default router;
