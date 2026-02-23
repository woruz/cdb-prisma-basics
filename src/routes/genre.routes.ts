import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// Create Genre
router.post('/', async (req, res) => {
  const { name } = req.body;

  const genre = await prisma.genre.create({
    data: { name }
  });

  res.json(genre);
});

// List books by Genre
router.get('/:id/books', async (req, res) => {
  const genreId = req.params.id;

  const books = await prisma.book.findMany({
    where: {
      genres: {
        some: {
          genreId: genreId
        }
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

  res.json(books);
});

export default router;