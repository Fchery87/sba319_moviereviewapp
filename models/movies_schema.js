import mongoose from 'mongoose';

const { Schema } = mongoose;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  director: {
    type: String,
    required: true,
    trim: true,
  },
  releaseYear: {
    type: Number,
    required: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
