import { Router } from "express";
import { createGenre, getBooksByGenre } from "../controllers/genre.controller";

const router = Router();

router.post("/", createGenre);
router.get("/:id/books", getBooksByGenre);

export default router;