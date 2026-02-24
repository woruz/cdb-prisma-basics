import { Request, Response } from "express";
import { prisma } from "../prisma";

// Create Author
export const createAuthor = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const author = await prisma.author.create({
      data: { name },
    });

    res.status(201).json(author);
  } catch (error) {
    console.log({error})
    res.status(500).json({ error: "Failed to create author" });
  }
};

// List Books by Author
export const getBooksByAuthor = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({ error: "Author ID is required" });
    }

    const books = await prisma.book.findMany({
      where: { authorId: id },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};