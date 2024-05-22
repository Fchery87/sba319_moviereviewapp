import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Movie', // Reference to the Movie model
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
