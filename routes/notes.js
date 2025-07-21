const express = require('express');
const Note = require('../models/Note');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get all notes for authenticated user
router.get('/', auth, async (req, res) => {
    const notes = await Note.find({ user: req.user });
    res.json(notes);
});

// Create a new note
router.post('/', auth, async (req, res) => {
    const { content } = req.body;
    const note = new Note({ user: req.user, content });
    await note.save();
    res.status(201).json(note);
});

// Edit a note
router.put('/:id', auth, async (req, res) => {
    const { content } = req.body;
    const updated = await Note.findOneAndUpdate(
        { _id: req.params.id, user: req.user },
        { content },
        { new: true }
    );
    res.json(updated);
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ message: 'Note deleted' });
});

module.exports = router;
