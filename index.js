import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import usersRouter from './routes/users.js';
import reviewsRouter from './routes/reviews.js';
import moviesRouter from './routes/movies.js';

dotenv.config();

mongoose.connect(process.env.ATLAS_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();
const PORT = process.env.PORT || 4500;

//! ====== MIDDLEWARE ======
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//! ====== ROUTES ======

app.get('/', (req, res) => {
  res.send('Welcome to the SBA 319');
});

app.use('/users', usersRouter);
app.use('/reviews', reviewsRouter);
app.use('/movies', moviesRouter);

//! ====== GLOBAL HANDLING ======

app.use((err, _req, res, next) => {
  res.status(500).send('Server Error!');
});

//! ====== LISTENING PORT ======

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
