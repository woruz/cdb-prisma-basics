import { Router } from 'express';
import { prisma } from '../prisma.js';

const router = Router();

// Create Author
router.post('/', async (req, res) => {
  const { name } = req.body;

  const author = await prisma.author.create({
    data: { name }
  });

  res.json(author);
});

// List books by Author
router.get('/:id/books', async (req, res) => {
  const books = await prisma.book.findMany({
    where: { authorId: req.params.id },
    include: { genres: true }
  });

  res.json(books);
});

export default router;