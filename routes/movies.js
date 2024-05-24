import express from 'express';
import db from '../db/conn.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Sample movie document structure
/**
 * {
 *  "title": "Inception",
 *  "director": "Christopher Nolan",
 *  "writers": ["Christopher Nolan"],
 *  "stars": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
 *  "releaseYear": 2010,
 *  "genre": "Sci-Fi",
 *  "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
 *  "imageUrl": "http://example.com/image.jpg",
 *  "imdbUrl": "http://www.imdb.com/title/tt1375666/"
 * }
 */

// Create a new movie - POST /movies/
router.post('/', async (req, res) => {
  try {
    const collection = await db.collection('movies');
    const newMovie = req.body;
    const result = await collection.insertOne(newMovie);
    res.status(201).json(result); // Return full result including insertedId
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all movies - GET /movies/
router.get('/', async (req, res) => {
  try {
    const collection = await db.collection('movies');
    const movies = await collection.find({}).toArray();
    res.status(200).json(movies); // Return all movies in the collection
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single movie by ID - GET /movies/:id
router.get('/:id', async (req, res) => {
  try {
    const collection = await db.collection('movies');
    const movieId = new ObjectId(req.params.id);
    const movie = await collection.findOne({ _id: movieId });
    if (!movie) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json(movie); // Return the found movie
    }
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a movie by ID - PUT /movies/:id
router.put('/:id', async (req, res) => {
  try {
    const collection = await db.collection('movies');
    const movieId = new ObjectId(req.params.id);
    const updatedMovie = req.body;
    const result = await collection.updateOne(
      { _id: movieId },
      { $set: updatedMovie }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json({ message: 'Movie updated successfully' });
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a movie by ID - DELETE /movies/:id
router.delete('/:id', async (req, res) => {
  try {
    const collection = await db.collection('movies');
    let movieId;
    try {
      movieId = new ObjectId(req.params.id);
    } catch (error) {
      console.error('Invalid movie ID:', error);
      return res.status(400).json({ message: 'Invalid movie ID' });
    }

    console.log(`Attempting to delete movie with ID: ${movieId}`);

    const result = await collection.deleteOne({ _id: movieId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Movie not found' });
    } else {
      res.status(200).json({ message: 'Movie deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add multiple movies - POST /movies/bulk
router.post('/bulk', async (req, res) => {
  try {
    const collection = await db.collection('movies');
    const newMovies = req.body;
    const result = await collection.insertMany(newMovies);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding bulk movies:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete multiple movies - DELETE /movies/bulk
router.delete('/bulk', async (req, res) => {
  try {
    const collection = await db.collection('movies');
    const movieIds = req.body.movieIds.map((id) => {
      try {
        return new ObjectId(id);
      } catch (error) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
    });

    const result = await collection.deleteMany({ _id: { $in: movieIds } });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'No movies found to delete' });
    } else {
      res.status(200).json({ message: 'Movies deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting multiple movies:', error);
    if (error.message.includes('Invalid ObjectId')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

export default router;
