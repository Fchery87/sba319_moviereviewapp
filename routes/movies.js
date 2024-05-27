import express from 'express';
import Movie from '../models/movies_schema.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Create a new movie
router.post('/', async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const result = await newMovie.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a movie by ID
router.put('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json(movie);
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a movie by ID
router.delete('/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json({ message: 'Movie deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add multiple movies
router.post('/bulk', async (req, res) => {
  try {
    const movies = req.body;
    const result = await Movie.insertMany(movies);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding bulk movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
