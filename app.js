require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/admin-auth/admin-auth.routes');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer().none()); // Add this line to handle form-data

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});