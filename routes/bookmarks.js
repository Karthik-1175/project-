const express = require('express');
const Bookmark = require('../models/Bookmark');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get all bookmarks for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ user: req.user });
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching bookmarks', error: err.message });
    }
});

// Create a new bookmark
router.post('/', auth, async (req, res) => {
    const { title, url } = req.body;
    if (!title || !url) {
        return res.status(400).json({ message: 'Title and URL are required' });
    }
    try {
        const bookmark = new Bookmark({ user: req.user, title, url });
        await bookmark.save();
        res.status(201).json(bookmark);
    } catch (err) {
        res.status(500).json({ message: 'Error saving bookmark', error: err.message });
    }
});

// Update an existing bookmark
router.put('/:id', auth, async (req, res) => {
    const { title, url } = req.body;
    try {
        const updatedBookmark = await Bookmark.findOneAndUpdate(
            { _id: req.params.id, user: req.user },
            { title, url },
            { new: true }
        );
        if (!updatedBookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        res.json(updatedBookmark);
    } catch (err) {
        res.status(500).json({ message: 'Error updating bookmark', error: err.message });
    }
});

// Delete a bookmark
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedBookmark = await Bookmark.findOneAndDelete({ _id: req.params.id, user: req.user });
        if (!deletedBookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }
        res.json({ message: 'Bookmark deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting bookmark', error: err.message });
    }
});

module.exports = router;
