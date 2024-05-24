import express from 'express';
import db from '../db/conn.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Create a new review - POST /reviews/
router.post('/', async (req, res) => {
  try {
    const collection = await db.collection('reviews');
    const newReview = req.body;
    newReview.movieId = new ObjectId(newReview.movieId); // Ensure movieId is an ObjectId
    const result = await collection.insertOne(newReview);
    res.status(201).json(result); // Return full result including insertedId
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all reviews or reviews by movieId - GET /reviews/
router.get('/', async (req, res) => {
  try {
    const collection = await db.collection('reviews');
    const query = req.query.movieId ? { movieId: new ObjectId(req.query.movieId) } : {};
    const reviews = await collection.find(query).toArray();
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single review by ID - GET /reviews/:id
router.get('/:id', async (req, res) => {
  try {
    const collection = await db.collection('reviews');
    const reviewId = new ObjectId(req.params.id);
    const review = await collection.findOne({ _id: reviewId });
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

// Update a review by ID - PUT /reviews/:id
router.put('/:id', async (req, res) => {
  try {
    const collection = await db.collection('reviews');
    const reviewId = new ObjectId(req.params.id);
    const updatedReview = req.body;
    const result = await collection.updateOne(
      { _id: reviewId },
      { $set: updatedReview }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.status(200).json({ message: 'Review updated successfully' });
    }
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a review by ID - DELETE /reviews/:id
router.delete('/:id', async (req, res) => {
  try {
    const collection = await db.collection('reviews');
    let reviewId;
    try {
      reviewId = new ObjectId(req.params.id);
    } catch (error) {
      console.error('Invalid review ID:', error);
      return res.status(400).json({ message: 'Invalid review ID' });
    }

    const result = await collection.deleteOne({ _id: reviewId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.status(200).json({ message: 'Review deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add multiple reviews - POST /reviews/bulk
router.post('/bulk', async (req, res) => {
  try {
    const collection = await db.collection('reviews');
    const newReviews = req.body.map(review => ({
      ...review,
      movieId: new ObjectId(review.movieId), // Ensure movieId is an ObjectId
    }));
    const result = await collection.insertMany(newReviews);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding bulk reviews:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete multiple reviews - DELETE /reviews/bulk
router.delete('/bulk', async (req, res) => {
  try {
    const collection = await db.collection('reviews');
    const reviewIds = req.body.reviewIds.map((id) => {
      try {
        return new ObjectId(id);
      } catch (error) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
    });

    const result = await collection.deleteMany({ _id: { $in: reviewIds } });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'No reviews found to delete' });
    } else {
      res.status(200).json({ message: 'Reviews deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting multiple reviews:', error);
    if (error.message.includes('Invalid ObjectId')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

export default router;
