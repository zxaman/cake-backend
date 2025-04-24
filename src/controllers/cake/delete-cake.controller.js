const Cake = require('../../models/cake.model');
const fs = require('fs');
const path = require('path');

exports.deleteCake = async (req, res) => {
  try {
    // Find the cake first to get the image filename
    const cake = await Cake.findById(req.params.id);

    if (!cake) {
      return res.status(404).json({
        success: false,
        error: 'Cake not found'
      });
    }

    // Get the image path
    const imagePath = path.join(__dirname, '../../uploads/', cake.images[0]);

    // Delete the image file
    if (cake.images && cake.images.length > 0) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        }
      });
    }

    // Delete the cake from database
    await Cake.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Cake and associated image deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};