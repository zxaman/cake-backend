const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
    calories: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    carbohydrates: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    productId: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 150
    },
    category: {
        type: String,
        required: true,
        enum: ['Cakes', 'Muffins', 'Pastries', 'Cupcakes', 'Cookies', 'Breads']
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    cardDescription: {
        type: String,
        required: true
    },
    detailDescription: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    nutritionInfo: {
        type: nutritionSchema,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to set category based on productId
productSchema.pre('save', function(next) {
    if (this.productId >= 1 && this.productId <= 25) {
        this.category = 'Cakes';
    } else if (this.productId >= 26 && this.productId <= 50) {
        this.category = 'Muffins';
    } else if (this.productId >= 51 && this.productId <= 75) {
        this.category = 'Pastries';
    } else if (this.productId >= 76 && this.productId <= 100) {
        this.category = 'Cupcakes';
    } else if (this.productId >= 101 && this.productId <= 125) {
        this.category = 'Cookies';
    } else if (this.productId >= 126 && this.productId <= 150) {
        this.category = 'Breads';
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);