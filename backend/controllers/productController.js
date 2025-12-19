const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const { minioClient } = require('../config/minio');
const crypto = require('crypto');
const xlsx = require('xlsx');

// @desc    Obtener todos los productos, con opción de filtrar por categoría
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { categoria } = req.query;
  const filter = categoria ? { categoria } : {};

  const products = await Product.find(filter).populate('categoria');
  res.json(products);
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoria');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error(`Error al obtener producto por ID: ${error.message}`);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// @desc    Crear un producto
//// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, descripcion, precio, sku, stock, categoria, especificaciones } = req.body;
  let img_url = '';

  try {
    if (req.file) {
      const bucketName = process.env.MINIO_BUCKET_NAME;
      const fileBuffer = req.file.buffer;
      const fileName = `${crypto.randomUUID()}-${req.file.originalname}`;
      
      await minioClient.putObject(bucketName, fileName, fileBuffer);
      
      img_url = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    }

    const product = new Product({
      nombre,
      descripcion,
      precio,
      sku,
      stock,
      categoria,
      especificaciones,
      img_url: img_url,
    });

    const createdProduct = await product.save();
    await createdProduct.populate('categoria');
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
  
  const { nombre, descripcion, precio, sku, stock, categoria, especificaciones } = req.body;

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
      
      product.img_url = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
    }

    product.nombre = nombre || product.nombre;
    product.descripcion = descripcion || product.descripcion;
    product.precio = precio ?? product.precio;
    product.sku = sku || product.sku;
    product.stock = stock ?? product.stock;
    product.categoria = categoria || product.categoria;
    product.especificaciones = especificaciones || product.especificaciones;

    const updatedProduct = await product.save();
    await updatedProduct.populate('categoria');
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
    // if (product.img_url) { ... }
    await product.deleteOne();
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ message: 'Producto no encontrado' });
  }
};

// @desc    Exportar productos a XLSX
// @route   GET /api/products/export
// @access  Private/Admin
const exportProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('categoria');

    const productsForSheet = products.map(p => ({
      'Nombre': p.nombre,
      'SKU': p.sku,
      'Categoría': p.categoria?.name || 'Sin categoría',
      'Precio (Bs)': p.precio,
      'Stock': p.stock,
      'Descripción': p.descripcion,
      'URL de Imagen': p.img_url,
      'Especificaciones': JSON.stringify(p.especificaciones),
    }));

    const worksheet = xlsx.utils.json_to_sheet(productsForSheet);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Productos');

    // Escribir el libro de trabajo en un buffer
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="productos.xlsx"'
    );

    res.send(buffer);
  } catch (error) {
    console.error('Error al exportar productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProducts,
};