const User = require('../models/User');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Order = require('../models/Order');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const serviceCount = await Service.countDocuments();
    const projectCount = await Project.countDocuments();
    const orderCount = await Order.countDocuments();

    res.json({
      users: userCount,
      products: productCount,
      services: serviceCount,
      projects: projectCount,
      orders: orderCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getStats,
};
