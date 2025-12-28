import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';
import { useCart } from '../context/CartContext';

const KitDetail = () => {
  const { id } = useParams();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const response = await authenticatedFetch(`/kits/${id}`);
        if (response.ok) {
          const data = await response.json();
          setKit(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar el kit');
        }
      } catch (err) {
        console.error('Error fetching kit:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchKit();
  }, [id]);

  const handleBuyKit = async () => {
    const confirmClear = window.confirm(
      'Al comprar este kit, tu carrito actual será vaciado y se llenará con los productos de este kit. ¿Deseas continuar?'
    );

    if (confirmClear) {
      try {
        console.log('handleBuyKit: Clearing cart');
        await clearCart();
        console.log('handleBuyKit: Cart cleared');

        console.log('handleBuyKit: Adding kit products to cart');
        for (const item of kit.products) {
          await addToCart(item.productId._id, item.quantity, 'Product');
          console.log(`handleBuyKit: Added product ${item.productId.nombre} (x${item.quantity})`);
        }
        console.log('handleBuyKit: All kit products added');

        // Store kit prices in localStorage
        localStorage.setItem('kitTotalPriceBeforeDiscount', kit.totalPriceBeforeDiscount);
        localStorage.setItem('kitFinalPrice', kit.finalPrice);
        console.log('handleBuyKit: Kit prices stored in localStorage');

        navigate('/checkout');
      } catch (err) {
        console.error('Error al comprar el kit:', err);
        setError('Error al procesar la compra del kit.');
      }
    } else {
      console.log('handleBuyKit: User cancelled purchase.');
    }
  };

  if (loading) return <div className="container mx-auto px-4 mt-8">Cargando kit...</div>;
  if (error) return <div className="container mx-auto px-4 mt-8 text-red-500">Error: {error}</div>;
  if (!kit) return <div className="container mx-auto px-4 mt-8">Kit no encontrado.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{kit.name}</h2>
      {kit.imageUrl && (
        <img src={kit.imageUrl} alt={kit.name} className="w-full h-96 object-cover rounded-lg mb-6" />
      )}
      <p className="text-secondary mb-4">{kit.description}</p>
      {kit.totalPriceBeforeDiscount && (
        <p className="text-text-primary text-lg mt-2">
          Precio Total (sin desc.): <span className="line-through">Bs {kit.totalPriceBeforeDiscount.toFixed(2)}</span>
        </p>
      )}
      <p className="text-text-primary font-bold text-xl mt-2">
        Precio Final: Bs {kit.finalPrice ? kit.finalPrice.toFixed(2) : '0.00'}
      </p>
      {kit.discountPercentage > 0 && (
        <p className="text-green-500 font-semibold text-lg">
          ¡Ahorra {kit.discountPercentage}%!
        </p>
      )}
      <div className="mt-6">
        <button
          onClick={handleBuyKit}
          className="bg-primary text-white py-3 px-6 rounded-md hover:opacity-90 transition duration-300 text-lg"
        >
          Comprar Kit
        </button>
      </div>
      <h3 className="text-2xl font-bold mt-6 mb-4">Productos en este kit</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kit.products.map(item => (
          <div key={item.productId._id} className="bg-card-bg rounded-lg shadow-md p-4">
            <h4 className="text-xl font-semibold">{item.productId.nombre}</h4>
            <p className="text-secondary">Cantidad: {item.quantity}</p>
            <p className="text-secondary">Precio unitario: Bs {item.priceAtTimeOfAddition.toFixed(2)}</p>
            <p className="text-secondary font-bold">Subtotal: Bs {(item.priceAtTimeOfAddition * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitDetail;
