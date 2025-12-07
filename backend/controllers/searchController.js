const Product = require('../models/Product');
const Service = require('../models/Service');

exports.search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const regex = new RegExp(query, 'i'); // 'i' for case-insensitive

    const products = await Product.find({
      $or: [
        { name: regex },
        { description: regex }
      ]
    });

    const services = await Service.find({
      $or: [
        { name: regex },
        { description: regex }
      ]
    });

    res.json({ products, services });
  } catch (error) {
    res.status(500).json({ message: 'Server error during search', error: error.message });
  }
};
