const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // Keep only one declaration
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));

// Other Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup
const upload = multer();

// Routes with form-data support
app.use('/api/user', upload.none(), require('./src/routes/user-auth/user-auth.routes'));
app.use('/api/products', require('./src/routes/product/product.routes'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));