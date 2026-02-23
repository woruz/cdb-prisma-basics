import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// Create Book
router.post('/', async (req, res) => {
  const { title, authorId, genreIds } = req.body;

  const book = await prisma.book.create({
    data: {
      title,
      author: {
        connect: { id: authorId }
      },
      genres: {
        create: genreIds.map((genreId: string) => ({
          genre: {
            connect: { id: genreId }
          }
        }))
      }
    },
    include: {
      author: true,
      genres: {
        include: {
          genre: true
        }
      }
    }
  });

  res.json(book);
});

// Get Book with Author name + Genre count
router.get('/:id', async (req, res) => {
  const book = await prisma.book.findUnique({
    where: { id: req.params.id },
    include: {
      author: { select: { name: true } },
      genres: {
        include: {
          genre: true
        }
      }
    }
  });

  if (!book) {
    return res.status(404).json({ message: 'Not found' });
  }

  const genresWithCount = await Promise.all(
    book.genres.map(async (bookGenre) => {
      const totalBooks = await prisma.bookGenre.count({
        where: { genreId: bookGenre.genreId }
      });

      return {
        id: bookGenre.genre.id,
        name: bookGenre.genre.name,
        totalBooks
      };
    })
  );

  res.json({
    id: book.id,
    title: book.title,
    author: book.author,
    genres: genresWithCount
  });
});

// Delete Book
router.delete('/:id', async (req, res) => {
  await prisma.book.delete({
    where: { id: req.params.id }
  });

  res.json({ message: 'Book deleted successfully' });
});

export default router;