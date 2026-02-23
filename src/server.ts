import express from 'express';
import authorRoutes from './routes/author.routes';
import bookRoutes from './routes/book.routes';
import genreRoutes from './routes/genre.routes';

const app = express();
app.use(express.json());

app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);
app.use('/genres', genreRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});