const Cake = require('../../models/cake.model');

exports.updateCake = async (req, res) => {
  try {
    const cake = await Cake.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!cake) {
      return res.status(404).json({
        success: false,
        error: 'Cake not found'
      });
    }

    res.status(200).json({
      success: true,
      data: cake
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};