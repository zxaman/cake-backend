const Category = require('../../models/category.model');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};