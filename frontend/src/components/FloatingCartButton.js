import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Cart } from 'react-bootstrap-icons';
import './FloatingCartButton.css';

const FloatingCartButton = ({ onClick }) => {
  const { cart } = useCart();

  const cartItemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // The cart button should be visible to all users, including admins,
  // as admins now use the cart to select items for kit creation.
  // The logic inside CartSidebar will differentiate between admin and client actions.

  return (
    <button onClick={onClick} className="floating-cart-button">
      <Cart className="w-6 h-6" />
      {cartItemCount > 0 && (
        <span className="cart-count">{cartItemCount}</span>
      )}
    </button>
  );
};

export default FloatingCartButton;
