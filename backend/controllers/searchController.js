const Product = require('../models/Product');
const Service = require('../models/Service');
const Category = require('../models/Category'); // Import Category model

// Helper function to create accent-insensitive regex
const createAccentInsensitiveRegex = (query) => {
  return query
    .normalize('NFD') // Normalize to NFD (Canonical Decomposition)
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/a/gi, '[aáàäâ]')
    .replace(/e/gi, '[eéèëê]')
    .replace(/i/gi, '[iíìïî]')
    .replace(/o/gi, '[oóòöô]')
    .replace(/u/gi, '[uúùüû]')
    .replace(/n/gi, '[nñ]')
    .replace(/c/gi, '[cç]') // For languages like Portuguese/French
    // Add more characters if needed for other languages
};

exports.search = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const accentInsensitiveQuery = createAccentInsensitiveRegex(query);
    const regex = new RegExp(accentInsensitiveQuery, 'i'); // 'i' for case-insensitive and now accent-insensitive

    const productFilter = {
      $or: [
        { nombre: regex },
        { descripcion: regex }
      ]
    };
    if (req.query.category && req.query.category !== 'Todos') {
      const categoryName = req.query.category;
      if (categoryName === 'Kits de Vigilancia') {
        productFilter.isKit = true; // Filter by isKit property for kits
      } else {
        const category = await Category.findOne({ name: categoryName }); // Find category by name

        if (category) {
          productFilter.categoria = category._id; // Use category _id for filtering
        } else {
          // If category not found, no products will match this filter
          productFilter.categoria = null; 
        }
      }
    }

    const products = await Product.find(productFilter).populate('categoria', 'name'); // Populate 'categoria' field and select only the 'name'

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

    const accentInsensitiveQuery = createAccentInsensitiveRegex(query);
    const regex = new RegExp(accentInsensitiveQuery, 'i'); // 'i' for case-insensitive and now accent-insensitive

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
