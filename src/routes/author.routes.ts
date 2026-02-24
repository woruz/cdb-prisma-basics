import { Router } from "express";
import { createAuthor, getBooksByAuthor } from "../controllers/author.controller";

const router = Router();

router.post("/", createAuthor);
router.get("/:id/books", getBooksByAuthor);

export default router;