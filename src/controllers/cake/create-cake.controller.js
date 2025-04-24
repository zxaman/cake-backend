const Cake = require('../../models/cake.model');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/')); // Updated path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure multer upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only images.'));
    }
  }
}).single('image'); // Make sure to use 'image' as the field name

exports.createCake = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        error: `Upload error: ${err.message}`
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Please upload an image'
        });
      }

      const { name, price, description, flavors } = req.body;

      const cake = await Cake.create({
        name,
        price,
        description,
        flavors: flavors ? flavors.split(',').map(flavor => flavor.trim()) : [],
        images: [req.file.filename]
      });

      res.status(201).json({
        success: true,
        data: cake
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err.message
      });
    }
  });
};