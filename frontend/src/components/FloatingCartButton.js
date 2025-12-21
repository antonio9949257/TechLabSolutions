import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Cart } from 'react-bootstrap-icons';
import './FloatingCartButton.css';

const FloatingCartButton = () => {
  const { user } = useAuth();
  const { cart, toggleCart } = useCart();

  const cartItemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  if (user?.role !== 'cliente') {
    return null;
  }

  return (
    <button onClick={toggleCart} className="floating-cart-button">
      <Cart className="w-6 h-6" />
      {cartItemCount > 0 && (
        <span className="cart-count">{cartItemCount}</span>
      )}
    </button>
  );
};

export default FloatingCartButton;
