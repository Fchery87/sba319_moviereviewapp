import express from 'express';
import db from '../db/conn.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Sample comment document structure
/**
 * {
 *  "postId": "60c72b2f9b1e8b6f4f4d8f42",
 *  "author": "user123",
 *  "content": "This is a comment",
 *  "createdAt": "2021-06-13T12:00:00Z"
 * }
 */

// Create a new comment - POST /comments/
router.post('/', async (req, res) => {
  try {
    const collection = await db.collection('comments');
    const newComment = req.body;
    const result = await collection.insertOne(newComment);
    res.status(201).json(result); // Return full result including insertedId
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all comments - GET /comments/
router.get('/', async (req, res) => {
  try {
    const collection = await db.collection('comments');
    const comments = await collection.find({}).toArray();
    res.status(200).json(comments); // Return all comments in the collection
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get a single comment by ID - GET /comments/:id
router.get('/:id', async (req, res) => {
  try {
    const collection = await db.collection('comments');
    const commentId = new ObjectId(req.params.id);
    const comment = await collection.findOne({ _id: commentId });
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json(comment); // Return the found comment
    }
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update a comment by ID - PUT /comments/:id
router.put('/:id', async (req, res) => {
  try {
    const collection = await db.collection('comments');
    const commentId = new ObjectId(req.params.id);
    const updatedComment = req.body;
    const result = await collection.updateOne(
      { _id: commentId },
      { $set: updatedComment }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json({ message: 'Comment updated successfully' });
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a comment by ID - DELETE /comments/:id
router.delete('/:id', async (req, res) => {
  try {
    const collection = await db.collection('comments');
    let commentId;
    try {
      commentId = new ObjectId(req.params.id);
    } catch (error) {
      console.error('Invalid comment ID:', error);
      return res.status(400).json({ message: 'Invalid comment ID' });
    }

    const result = await collection.deleteOne({ _id: commentId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Comment not found' });
    } else {
      res.status(200).json({ message: 'Comment deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add multiple comments - POST /comments/bulk
router.post('/bulk', async (req, res) => {
  try {
    const collection = await db.collection('comments');
    const newComments = req.body;
    const result = await collection.insertMany(newComments);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding bulk comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete multiple comments - DELETE /comments/bulk
router.delete('/bulk', async (req, res) => {
  try {
    const collection = await db.collection('comments');
    const commentIds = req.body.commentIds.map((id) => {
      try {
        return new ObjectId(id);
      } catch (error) {
        throw new Error(`Invalid ObjectId: ${id}`);
      }
    });

    const result = await collection.deleteMany({ _id: { $in: commentIds } });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'No comments found to delete' });
    } else {
      res.status(200).json({ message: 'Comments deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting multiple comments:', error);
    if (error.message.includes('Invalid ObjectId')) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

export default router;