const express = require('express');
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const todos = await Todo.find({ user: req.user });
    res.json(todos);
});

router.post('/', auth, async (req, res) => {
    const { text } = req.body;
    const todo = new Todo({ user: req.user, text });
    await todo.save();
    res.status(201).json(todo);
});

router.put('/:id', auth, async (req, res) => {
    const { text, completed } = req.body;
    const updated = await Todo.findOneAndUpdate(
        { _id: req.params.id, user: req.user },
        { text, completed },
        { new: true }
    );
    res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
    await Todo.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ message: 'To-do deleted' });
});

module.exports = router;
