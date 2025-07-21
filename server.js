const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const todoRoutes = require('./routes/todos');
const bookmarkRoutes = require('./routes/bookmarks');
const habitRoutes = require('./routes/habits');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/habits', habitRoutes);

// Connect to MongoDB & Start Server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(process.env.PORT, () =>
            console.log(`Server running on port ${process.env.PORT}`)
        );
    })
    .catch(err => console.error(err));
