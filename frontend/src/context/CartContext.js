import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { token } = useAuth();

  const openCart = () => setIsCartOpen(true);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const response = await authenticatedFetch('/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity) => {
    // We can't reliably get the state before the async call without using a ref,
    // but for this use case, we can just check the state after.
    // A simpler way is to just open it. The user can close it if they want.
    // Let's try a simpler approach first.
    try {
      const response = await authenticatedFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
      if (response.ok) {
        await fetchCart(); // Refetch cart to get updated state
        if (!isCartOpen) {
          openCart();
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await authenticatedFetch(`/cart/items/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await authenticatedFetch(`/cart/items/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    fetchCart,
    isCartOpen,
    openCart,
    toggleCart,
    closeCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
