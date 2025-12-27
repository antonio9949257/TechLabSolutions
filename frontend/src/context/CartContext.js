import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart({ items: [], totalPrice: 0 });
      setLoading(false);
      return;
    }
    try {
      const response = await authenticatedFetch('/cart');
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else {
        setCart({ items: [], totalPrice: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
      setLoading(false);
    }
  }, [token, fetchCart]);

  const addToCart = async (itemId, quantity, itemType) => {
    try {
      const response = await authenticatedFetch('/cart', {
        method: 'POST',
        body: JSON.stringify({ itemId, quantity, itemType }),
      });
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await authenticatedFetch(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await authenticatedFetch(`/cart/items/${itemId}`, {
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

  const clearCart = async () => {
    try {
      const response = await authenticatedFetch('/cart', {
        method: 'DELETE',
      });
      if (response.ok) {
        setCart({ items: [], totalPrice: 0 });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart, // Export clearCart
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
