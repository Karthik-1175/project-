const express = require('express');
const Habit = require('../models/Habit');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    const habits = await Habit.find({ user: req.user });
    res.json(habits);
});

router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    const habit = new Habit({ user: req.user, name });
    await habit.save();
    res.status(201).json(habit);
});

router.put('/:id', auth, async (req, res) => {
    const { name, streak, lastCompleted } = req.body;
    const updated = await Habit.findOneAndUpdate(
        { _id: req.params.id, user: req.user },
        { name, streak, lastCompleted },
        { new: true }
    );
    res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user });
    res.json({ message: 'Habit deleted' });
});

module.exports = router;
