import { NextFunction, Request, Response } from "express";
import Database from "better-sqlite3";
import { Task } from "../models/task";

const db = new Database("db.sqlite", { verbose: console.log });

db.prepare(
  `
CREATE TABLE IF NOT EXISTS tasks (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    level INTEGER NOT NULL,
    next_date TEXT NOT NULL
)`,
).run();

export const createTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, url } = req.body;
    const now = new Date();
    const newTask: Task = {
      name: name,
      url: url,
      level: 1,
      next_date: now,
    };

    db.prepare(
      "INSERT INTO tasks (name, url, level, next_date) VALUES (?, ?, ?, ?)",
    ).run(
      newTask.name,
      newTask.url,
      newTask.level,
      newTask.next_date.toISOString(),
    );
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = (_: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = db
      .prepare("SELECT * FROM tasks ORDER BY next_date DESC")
      .all() as Task[];
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getDueTasks = (_: Request, res: Response, next: NextFunction) => {
  try {
    const now = new Date().toISOString();
    const tasksDue = db
      .prepare(
        "SELECT * FROM tasks WHERE next_date < ? ORDER BY next_date DESC",
      )
      .all(now) as Task[];
    res.status(200).json(tasksDue);
  } catch (error) {
    next(error);
  }
};

export const getTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const task = db.prepare("SELECT * FROM tasks WHERE id=?").get(id) as Task;
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url, name } = req.body;
    const id = req.params.id;
    db.prepare("UPDATE tasks SET name=?, url=? WHERE id=?").run(name, url, id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

enum rating {
  EASY = 1,
  HARD = 2,
  IMPOSSIBLE = 3,
}

export const scheduleTask = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rate } = req.body;
    const id = req.params.id;
    const task = db.prepare("SELECT * FROM tasks WHERE id=?").get(id) as Task;
    let interval = 0;
    let nextLevel = task.level;

    switch (rate) {
      case rating.EASY:
        nextLevel += 1;
        console.log(nextLevel);
        interval = Math.pow(2, nextLevel);
        break;

      case rating.HARD:
        nextLevel += 1;
        interval = Math.pow(1.3, nextLevel);
        break;

      case rating.IMPOSSIBLE:
        nextLevel = 0;
        interval = 1;
        break;
    }

    const next_date = new Date();
    next_date.setDate(next_date.getDate() + interval);

    task.level = nextLevel;
    task.next_date = next_date;

    db.prepare("UPDATE tasks SET level=?, next_date=? WHERE id=?").run(
      task.level,
      task.next_date.toISOString(),
      id,
    );

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    db.prepare("DELETE FROM tasks WHERE id=?").run(id);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
