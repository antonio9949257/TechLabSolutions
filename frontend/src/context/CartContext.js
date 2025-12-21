import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const openCart = () => setIsCartOpen(true);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

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
        // Only open cart automatically if not on a mobile screen
        // or if the cart is already open (to keep it open if user wants)
        if (!isCartOpen && window.innerWidth >= 1024) { // Assuming 1024px as desktop breakpoint
          openCart();
        }
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

  const value = {
    cart,
    loading,
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
