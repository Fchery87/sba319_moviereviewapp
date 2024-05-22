import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import usersRouter from './routes/users.js';
import commentsRouter from './routes/comments.js';
import reviewsRouter from './routes/reviews.js';

dotenv.config();

mongoose.connect(process.env.ATLAS_URI);

const app = express();
const PORT = process.env.PORT || 4000;

//! ====== MIDDLEWARE ======

app.use(morgan('dev'));
app.use(express.json());



//! ====== ROUTES ======

app.get('/', (req, res) => {
  res.send('Welcome to the SBA 319');
});

app.use('/users', usersRouter);
app.use('/comments', commentsRouter)
app.use('/reviews', reviewsRouter)

//! ====== GLOBAL HANDLING ======

app.use((err, _req, res, next) => {
  res.status(500).send('Server Error!');
});

//! ====== LISTENING PORT ======

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});