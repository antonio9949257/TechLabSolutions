import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api'; // Assuming this handles file uploads or we'll need a dedicated one

const AdminCreateKit = () => {
  const { cart, loading, clearCart } = useCart();
  const navigate = useNavigate();

  const [kitName, setKitName] = useState('');
  const [kitDescription, setKitDescription] = useState('');
  const [kitPrice, setKitPrice] = useState(cart ? cart.totalPrice.toFixed(2) : '0.00');
  const [discountPercentage, setDiscountPercentage] = useState('0'); // New state for discount percentage
  const [kitImage, setKitImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return <div className="container mx-auto px-4 mt-8">Cargando carrito...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 mt-8">
        <h2 className="text-2xl font-bold mb-4">Crear Nuevo Kit</h2>
        <p>No hay productos en el carrito para crear un kit.</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-primary text-white py-2 px-4 rounded hover:opacity-90 transition"
        >
          Añadir Productos
        </button>
      </div>
    );
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setKitImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    if (!kitName || !kitDescription || !kitPrice || !kitImage) {
      setError('Por favor, complete todos los campos y suba una imagen.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', kitName);
    formData.append('description', kitDescription);
    formData.append('price', kitPrice);
    formData.append('discountPercentage', discountPercentage); // Add discount percentage
    formData.append('image', kitImage);
    formData.append('products', JSON.stringify(cart.items.map(item => ({
      productId: item.item._id,
      quantity: item.quantity,
      priceAtTimeOfAddition: item.price,
    }))));

    try {
      // This will require a new backend endpoint for kit creation
      const response = await authenticatedFetch('/kits', {
        method: 'POST',
        body: formData,
        // Do NOT set Content-Type header for FormData, browser does it automatically
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Kit creado exitosamente.');
        clearCart(); // Clear the cart after kit creation
        navigate('/admin/kits'); // Navigate to the kits management page
      } else {
        setError(data.message || 'Error al crear el kit.');
      }
    } catch (err) {
      console.error('Error creating kit:', err);
      setError('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Crear Nuevo Kit de Precios</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

      <div className="bg-card-bg p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Productos en el Kit</h3>
        <ul className="divide-y divide-gray-200 mb-4">
          {cart.items.map((cartItem) => (
            <li key={cartItem.item._id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{cartItem.item.nombre || cartItem.item.name}</p>
                <p className="text-sm text-secondary">Cantidad: {cartItem.quantity}</p>
              </div>
              <span className="font-semibold">Bs {(cartItem.price * cartItem.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center border-t pt-4">
          <p className="text-lg font-bold">Total del Kit:</p>
          <span className="text-lg font-bold">Bs {cart.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card-bg p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Detalles del Kit</h3>

        <div className="mb-4">
          <label htmlFor="kitName" className="block text-sm font-medium text-text-primary mb-2">Nombre del Kit</label>
          <input
            type="text"
            id="kitName"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={kitName}
            onChange={(e) => setKitName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="kitDescription" className="block text-sm font-medium text-text-primary mb-2">Descripción del Kit</label>
          <textarea
            id="kitDescription"
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={kitDescription}
            onChange={(e) => setKitDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="kitPrice" className="block text-sm font-medium text-text-primary mb-2">Precio del Kit (Bs)</label>
          <input
            type="number"
            id="kitPrice"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={kitPrice}
            onChange={(e) => setKitPrice(e.target.value)}
            step="0.01"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="discountPercentage" className="block text-sm font-medium text-text-primary mb-2">Porcentaje de Descuento (%)</label>
          <input
            type="number"
            id="discountPercentage"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            step="0.01"
            min="0"
            max="100"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="kitImage" className="block text-sm font-medium text-text-primary mb-2">Imagen del Kit</label>
          <input
            type="file"
            id="kitImage"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-700"
            required
          />
          {kitImage && (
            <p className="text-sm text-secondary mt-2">Archivo seleccionado: {kitImage.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creando Kit...' : 'Crear Kit'}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateKit;