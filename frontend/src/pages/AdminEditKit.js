import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext'; // To get user token for auth
import { XCircle } from 'react-bootstrap-icons'; // Import XCircle for close button

const AdminEditKit = ({ kitId, onClose, onSuccess }) => {
  const { token } = useAuth(); // Assuming token is needed for authenticatedFetch

  const [kitName, setKitName] = useState('');
  const [kitDescription, setKitDescription] = useState('');
  const [kitPrice, setKitPrice] = useState('0.00');
  const [discountPercentage, setDiscountPercentage] = useState('0');
  const [kitImage, setKitImage] = useState(null); // For new image file
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // To display current image
  const [kitProducts, setKitProducts] = useState([]); // New state for kit products
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingKit, setLoadingKit] = useState(true);

  useEffect(() => {
    if (!kitId) {
      setLoadingKit(false);
      return;
    }
    const fetchKit = async () => {
      try {
        const response = await authenticatedFetch(`/kits/${kitId}`); // Fetch kit by ID
        if (response.ok) {
          const data = await response.json();
          setKitName(data.name);
          setKitDescription(data.description);
          setKitPrice(data.price.toFixed(2));
          setDiscountPercentage(data.discountPercentage.toFixed(2));
          setCurrentImageUrl(data.imageUrl);
          setKitProducts(data.products); // Populate kitProducts state
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar el kit.');
        }
      } catch (err) {
        console.error('Error fetching kit:', err);
        setError('Error de conexión con el servidor.');
      } finally {
        setLoadingKit(false);
      }
    };

    fetchKit();
  }, [kitId, token]); // Re-fetch if ID or token changes

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

    if (!kitName || !kitDescription || !kitPrice) {
      setError('Por favor, complete todos los campos requeridos.');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('name', kitName);
    formData.append('description', kitDescription);
    formData.append('price', kitPrice);
    formData.append('discountPercentage', discountPercentage);
    if (kitImage) {
      formData.append('image', kitImage);
    }

    try {
      const response = await authenticatedFetch(`/kits/${kitId}`, {
        method: 'PUT',
        body: formData,
        // Do NOT set Content-Type header for FormData, browser does it automatically
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Kit actualizado exitosamente.');
        onSuccess(); // Call onSuccess callback to refresh parent list
        onClose(); // Close the modal
      } else {
        setError(data.message || 'Error al actualizar el kit.');
      }
    } catch (err) {
      console.error('Error updating kit:', err);
      setError('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingKit) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-card-bg p-8 rounded-lg shadow-lg w-full max-w-md relative">
          <p>Cargando kit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-card-bg p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          <XCircle className="w-7 h-7" />
        </button>
        <h2 className="text-3xl font-bold mb-6 text-text-primary">Editar Kit</h2>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold mb-4 text-text-primary">Detalles del Kit</h3>

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

          {/* Products in Kit */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-text-primary mb-2">Productos en este Kit</h4>
            {kitProducts.length === 0 ? (
              <p className="text-secondary">No hay productos en este kit.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {kitProducts.map((item) => (
                  <li key={item.productId._id} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.productId.nombre}</p>
                      <p className="text-sm text-secondary">Cantidad: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">Bs {(item.priceAtTimeOfAddition * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-6">
            <label htmlFor="kitImage" className="block text-sm font-medium text-text-primary mb-2">Imagen del Kit</label>
            {currentImageUrl && (
              <div className="mb-2">
                <p className="text-sm text-secondary">Imagen actual:</p>
                <img src={currentImageUrl} alt="Current Kit" className="w-32 h-32 object-cover rounded-md" />
              </div>
            )}
            <input
              type="file"
              id="kitImage"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-700"
            />
            {kitImage && (
              <p className="text-sm text-secondary mt-2">Nuevo archivo seleccionado: {kitImage.name}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Actualizando Kit...' : 'Actualizar Kit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditKit;