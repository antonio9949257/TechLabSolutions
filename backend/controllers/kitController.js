const asyncHandler = require('express-async-handler');
const Kit = require('../models/Kit');
const Product = require('../models/Product');
const { minioClient } = require('../config/minio');
const { v4: uuidv4 } = require('uuid');

// @desc    Create a new kit
// @route   POST /api/kits
// @access  Private/Admin
const createKit = asyncHandler(async (req, res) => {
  const { name, description, price, discountPercentage, products } = req.body;

  if (!name || !description || !price || !products) {
    res.status(400);
    throw new Error('Por favor, complete todos los campos requeridos para el kit.');
  }

  // Parse products array
  let parsedProducts;
  try {
    parsedProducts = JSON.parse(products);
    if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
      res.status(400);
      throw new Error('El kit debe contener al menos un producto.');
    }
  } catch (error) {
    res.status(400);
    throw new Error('Formato de productos inválido.');
  }

  // Verify products and their prices
  const productIds = parsedProducts.map(p => p.productId);
  const existingProducts = await Product.find({ _id: { $in: productIds } });

  if (existingProducts.length !== productIds.length) {
    res.status(404);
    throw new Error('Uno o más productos no fueron encontrados.');
  }

  const productsWithPrices = parsedProducts.map(item => {
    const product = existingProducts.find(p => p._id.toString() === item.productId);
    if (!product) {
      res.status(404);
      throw new Error(`Producto con ID ${item.productId} no encontrado.`);
    }
    return {
      productId: item.productId,
      quantity: item.quantity,
      priceAtTimeOfAddition: product.precio, // Use current product price from DB
    };
  });

  let imageUrl = '';
  if (req.file) {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    const fileExtension = req.file.originalname.split('.').pop();
    const objectName = `kits/${uuidv4()}.${fileExtension}`;

    try {
      await minioClient.putObject(bucketName, objectName, req.file.buffer, req.file.mimetype);
      imageUrl = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`;
      console.log('Generated imageUrl (createKit):', imageUrl);
    } catch (minioError) {
      console.error('Error uploading image to Minio:', minioError);
      res.status(500);
      throw new Error('Error al subir la imagen del kit.');
    }
  }

  const kit = await Kit.create({
    user: req.user.id,
    name,
    description,
    price,
    discountPercentage: discountPercentage || 0,
    imageUrl,
    products: productsWithPrices,
  });

  res.status(201).json({ message: 'Kit creado exitosamente', kit });
});

// @desc    Get all kits
// @route   GET /api/kits
// @access  Private/Admin
const getKits = asyncHandler(async (req, res) => {
  const kits = await Kit.find({}).populate('products.productId', 'nombre precio');

  const kitsWithCalculatedPrices = kits.map(kit => {
    const totalPriceBeforeDiscount = kit.products.reduce((acc, item) => {
      // Ensure item.productId and item.productId.precio exist
      return acc + (item.productId?.precio || 0) * item.quantity;
    }, 0);

    const finalPrice = totalPriceBeforeDiscount * (1 - (kit.discountPercentage || 0) / 100);

    return {
      ...kit.toObject(), // Convert Mongoose document to plain JavaScript object
      totalPriceBeforeDiscount: totalPriceBeforeDiscount,
      finalPrice: finalPrice,
    };
  });

  res.status(200).json(kitsWithCalculatedPrices);
});

// @desc    Get single kit
// @route   GET /api/kits/:id
// @access  Private/Admin
const getKit = asyncHandler(async (req, res) => {
  const kit = await Kit.findById(req.params.id).populate('products.productId', 'nombre precio');

  if (!kit) {
    res.status(404);
    throw new Error('Kit no encontrado');
  }

  const totalPriceBeforeDiscount = kit.products.reduce((acc, item) => {
    return acc + (item.productId?.precio || 0) * item.quantity;
  }, 0);

  const finalPrice = totalPriceBeforeDiscount * (1 - (kit.discountPercentage || 0) / 100);

  res.status(200).json({
    ...kit.toObject(),
    totalPriceBeforeDiscount: totalPriceBeforeDiscount,
    finalPrice: finalPrice,
  });
});

// @desc    Delete a kit
// @route   DELETE /api/kits/:id
// @access  Private/Admin
const deleteKit = asyncHandler(async (req, res) => {
  const kit = await Kit.findById(req.params.id);

  if (!kit) {
    res.status(404);
    throw new Error('Kit no encontrado');
  }

  await kit.deleteOne(); // Use deleteOne() instead of remove()
  res.status(200).json({ message: 'Kit eliminado exitosamente' });
});

// @desc    Update a kit
// @route   PUT /api/kits/:id
// @access  Private/Admin
const updateKit = asyncHandler(async (req, res) => {
  const { name, description, price, discountPercentage, products } = req.body;

  const kit = await Kit.findById(req.params.id);

  if (!kit) {
    res.status(404);
    throw new Error('Kit no encontrado');
  }

  // Handle image update if a new file is provided
  let imageUrl = kit.imageUrl;
  if (req.file) {
    const bucketName = process.env.MINIO_BUCKET_NAME;
    const fileExtension = req.file.originalname.split('.').pop();
    const objectName = `kits/${uuidv4()}.${fileExtension}`;

    try {
      await minioClient.putObject(bucketName, objectName, req.file.buffer, req.file.mimetype);
      imageUrl = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${objectName}`;
      console.log('Generated imageUrl (updateKit):', imageUrl);
    } catch (minioError) {
      console.error('Error uploading new image to Minio:', minioError);
      res.status(500);
      throw new Error('Error al subir la nueva imagen del kit.');
    }
  }

  // Parse products array if provided
  let parsedProducts = kit.products; // Default to existing products
  if (products) {
    try {
      parsedProducts = JSON.parse(products);
      if (!Array.isArray(parsedProducts) || parsedProducts.length === 0) {
        res.status(400);
        throw new Error('El kit debe contener al menos un producto.');
      }
    } catch (error) {
      res.status(400);
      throw new Error('Formato de productos inválido.');
    }

    // Verify products and their prices for update
    const productIds = parsedProducts.map(p => p.productId);
    const existingProducts = await Product.find({ _id: { $in: productIds } });

    if (existingProducts.length !== productIds.length) {
      res.status(404);
      throw new Error('Uno o más productos no fueron encontrados para la actualización.');
    }

    parsedProducts = parsedProducts.map(item => {
      const product = existingProducts.find(p => p._id.toString() === item.productId);
      if (!product) {
        res.status(404);
        throw new Error(`Producto con ID ${item.productId} no encontrado para la actualización.`);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        priceAtTimeOfAddition: product.precio, // Use current product price from DB
      };
    });
  }

  kit.name = name || kit.name;
  kit.description = description || kit.description;
  kit.price = price || kit.price;
  kit.discountPercentage = discountPercentage !== undefined ? discountPercentage : kit.discountPercentage;
  kit.imageUrl = imageUrl;
  kit.products = parsedProducts;

  const updatedKit = await kit.save();
  res.status(200).json({ message: 'Kit actualizado exitosamente', kit: updatedKit });
});


module.exports = {
  createKit,
  getKits,
  getKit, // Export getKit
  deleteKit,
  updateKit,
};