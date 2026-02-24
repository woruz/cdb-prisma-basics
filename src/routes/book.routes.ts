import { Router } from "express";
import {
  createBook,
  getSingleBook,
  deleteBook,
} from "../controllers/book.controller";

const router = Router();

router.post("/", createBook);
router.get("/:id", getSingleBook);
router.delete("/:id", deleteBook);

export default router;