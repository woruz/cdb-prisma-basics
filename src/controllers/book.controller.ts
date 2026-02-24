import { Request, Response } from "express";
import { prisma } from "../prisma";

// Create Book
export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, authorId, genreIds } = req.body;

    const book = await prisma.book.create({
      data: {
        title,
        authorId,
        genres: {
          create: genreIds.map((genreId: string) => ({
            genre: { connect: { id: genreId } },
          })),
        },
      },
      include: {
        author: true,
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
};

// Get Single Book with:
// - Author name
// - Genres
// - Total books per genre
export const getSingleBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          include: {
            _count: {
              select: { books: true },
            },
          },
        },
        genres: {
          include: {
            genre: {
              include: {
                _count: {
                  select: { books: true },
                },
              },
            },
          },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const formatted = {
      id: book.id,
      title: book.title,
      author: {
        id: book.author.id,
        name: book.author.name,
        totalBooks: book.author._count.books,
      },
      genres: book.genres.map((g) => ({
        id: g.genre.id,
        name: g.genre.name,
        totalBooks: g.genre._count.books,
      })),
    };

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
};

// Delete Book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.bookGenre.deleteMany({
      where: { bookId: id },
    });

    await prisma.book.delete({
      where: { id },
    });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
};