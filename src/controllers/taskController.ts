import { NextFunction } from 'express';
import Database from 'better-sqlite3';

const db = new Database();
export const createTask = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};
