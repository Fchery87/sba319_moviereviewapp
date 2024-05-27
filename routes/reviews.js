import express from 'express';
import Review from '../models/reviews_schema.js';
import Movie from '../models/movies_schema.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Create a new review
router.post('/', async (req, res) => {
  try {
    const newReview = new Review(req.body);
    const result = await newReview.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all reviews or reviews by movieId
router.get('/', async (req, res) => {
  try {
    const query = req.query.movieId ? { movieId: new ObjectId(req.query.movieId) } : {};
    const reviews = await Review.find(query).populate('movieId', 'title');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('movieId', 'title');
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a review by ID
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('movieId', 'title');
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a review by ID
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.status(200).json({ message: 'Review deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add multiple reviews
router.post('/bulk', async (req, res) => {
  try {
    const newReviews = req.body.map(review => ({
      ...review,
      movieId: new ObjectId(review.movieId),
    }));
    const result = await Review.insertMany(newReviews);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding bulk reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
