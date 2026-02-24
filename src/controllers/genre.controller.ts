import { Request, Response } from "express";
import { prisma } from "../prisma";

// Create Genre
export const createGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const genre = await prisma.genre.create({
      data: { name },
    });

    res.status(201).json(genre);
  } catch (error) {
    res.status(500).json({ error: "Failed to create genre" });
  }
};

// List Books by Genre
export const getBooksByGenre = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const books = await prisma.bookGenre.findMany({
      where: { genreId: id },
      include: { 
        book: {
          include: {
            author: true,
          },
        },
      },
    });

    res.json(books.map(bg => bg.book));
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
};