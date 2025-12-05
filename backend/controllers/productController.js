const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const { minioClient } = require('../config/minio');
const crypto = require('crypto');

// @desc    Obtener todos los productos, con opción de filtrar por categoría
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};

  const products = await Product.find(filter);
  res.json(products);
};

// @desc    Crear un producto
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, price, sku, stock, category, components } = req.body;
  let imageUrl = '';

  try {
    if (req.file) {
      const bucketName = process.env.MINIO_BUCKET_NAME;
      const fileBuffer = req.file.buffer;
      const fileName = `${crypto.randomUUID()}-${req.file.originalname}`;
      
      await minioClient.putObject(bucketName, fileName, fileBuffer);
      
      imageUrl = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    }

    const product = new Product({
      name,
      description,
      price,
      sku,
      stock,
      category,
      components,
      image: imageUrl,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error interno del servidor al subir la imagen' });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, description, price, sku, stock, category, components } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (req.file) {
      const bucketName = process.env.MINIO_BUCKET_NAME;
      const fileBuffer = req.file.buffer;
      const fileName = `${crypto.randomUUID()}-${req.file.originalname}`;
      
      await minioClient.putObject(bucketName, fileName, fileBuffer);
      
      product.image = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ?? product.price;
    product.sku = sku || product.sku;
    product.stock = stock ?? product.stock;
    product.category = category || product.category;
    product.components = components || product.components;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error interno del servidor al subir la imagen' });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Opcional: Eliminar la imagen de MinIO también
    // if (product.image) { ... }
    await product.deleteOne();
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
