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
        { nombre: regex },
        { descripcion: regex }
      ]
    }).populate('categoria', 'name'); // Populate 'categoria' field and select only the 'name'

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

exports.autocomplete = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]); // Return empty array if no query
    }

    const regex = new RegExp(query, 'i'); // 'i' for case-insensitive

    // Search for products
    const products = await Product.find(
      {
        $or: [{ nombre: regex }, { descripcion: regex }],
      },
      'nombre _id' // Select only nombre and _id
    ).limit(5); // Limit to 5 suggestions

    // Search for services
    const services = await Service.find(
      {
        $or: [{ name: regex }, { description: regex }],
      },
      'name _id' // Select only name and _id
    ).limit(5); // Limit to 5 suggestions

    const suggestions = [
      ...products.map((p) => ({ _id: p._id, name: p.nombre, type: 'product' })),
      ...services.map((s) => ({ _id: s._id, name: s.name, type: 'service' })),
    ];

    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ message: 'Server error during autocomplete', error: error.message });
  }
};
