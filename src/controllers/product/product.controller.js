const Product = require('../../models/product.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');  // Make sure fs is required

// Add this helper function
const deleteImageFile = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
};

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/products');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB limit
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
}).single('image');

// Create new product
exports.createProduct = async (req, res) => {
    try {
        upload(req, res, async function(err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            const {
                productId,
                name,
                price,
                cardDescription,
                detailDescription,
                ingredients,
                nutritionInfo
            } = req.body;

            // Validate productId range - update this section
            const productIdNum = parseInt(productId);
            if (isNaN(productIdNum) || productIdNum < 1 || productIdNum > 150) {
                if (req.file) {
                    deleteImageFile(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: 'Product ID must be a number between 1 and 150'
                });
            }

            // Determine category based on productId range
            let category;
            if (productIdNum <= 25) category = 'Cakes';
            else if (productIdNum <= 50) category = 'Muffins';
            else if (productIdNum <= 75) category = 'Pastries';
            else if (productIdNum <= 100) category = 'Cupcakes';
            else if (productIdNum <= 125) category = 'Cookies';
            else category = 'Breads';

            const product = await Product.create({
                productId: productIdNum,
                name,
                image: req.file.path,
                price,
                cardDescription,
                detailDescription,
                ingredients: JSON.parse(ingredients),
                nutritionInfo: JSON.parse(nutritionInfo),
                category // Add the determined category
            });

            res.status(201).json({
                success: true,
                data: product
            });
        });
    } catch (error) {
        if (req.file) {
            deleteImageFile(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all products with optional category filter
exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        
        const products = await Product.find(query).sort('productId');
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single product
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.id });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        upload(req, res, async function(err) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message
                });
            }

            const product = await Product.findOne({ productId: req.params.id });
            
            if (!product) {
                if (req.file) {
                    deleteImageFile(req.file.path);
                }
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            // If new image is uploaded, delete the old one
            if (req.file) {
                deleteImageFile(product.image);
                product.image = req.file.path;
            }

            // Update other fields with proper error handling
            try {
                const updateData = req.body;
                if (updateData.ingredients) {
                    product.ingredients = JSON.parse(updateData.ingredients);
                }
                if (updateData.nutritionInfo) {
                    product.nutritionInfo = JSON.parse(updateData.nutritionInfo);
                }

                Object.keys(updateData).forEach(key => {
                    if (key !== 'image' && key !== 'ingredients' && key !== 'nutritionInfo') {
                        product[key] = updateData[key];
                    }
                });

                await product.save();

                res.status(200).json({
                    success: true,
                    data: product
                });
            } catch (parseError) {
                if (req.file) {
                    deleteImageFile(req.file.path);
                }
                res.status(400).json({
                    success: false,
                    message: 'Invalid JSON format in ingredients or nutritionInfo'
                });
            }
        });
    } catch (error) {
        if (req.file) {
            deleteImageFile(req.file.path);
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ productId: req.params.id });
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete the associated image file
        deleteImageFile(product.image);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};