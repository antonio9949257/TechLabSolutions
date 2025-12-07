import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const { token } = useAuth();

  const openCart = () => setIsCartOpen(true);
  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const closeCart = () => setIsCartOpen(false);

  const fetchCart = async () => {
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
        // If cart is not found (e.g., 404), it means it's empty for the user
        setCart({ items: [], totalPrice: 0 });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalPrice: 0 }); // Also reset on network error
    } finally {
      setLoading(false); // Stop loading in any case
    }
  };

  useEffect(() => {
    const attemptFetch = async (retries = 3, delay = 1000) => {
      setLoading(true);
      if (!token) {
        setCart({ items: [], totalPrice: 0 });
        setLoading(false);
        return;
      }

      for (let i = 0; i < retries; i++) {
        try {
          const response = await authenticatedFetch('/cart');
          if (response.ok) {
            const data = await response.json();
            setCart(data);
            setLoading(false);
            return; // Success
          }
          if (response.status === 404) {
            setCart({ items: [], totalPrice: 0 });
            setLoading(false);
            return; // Empty cart, not an error
          }
          // Handle other non-ok responses as transient errors
          console.error(`Failed to fetch cart, status: ${response.status} on attempt ${i + 1}`);
        } catch (error) {
          console.error(`Network error fetching cart (attempt ${i + 1}):`, error);
        }

        if (i < retries - 1) {
          await new Promise(res => setTimeout(res, delay));
        }
      }

      // All retries failed
      setCart({ items: [], totalPrice: 0 });
      setLoading(false);
      console.error("Failed to fetch cart after multiple retries.");
    };

    attemptFetch();
  }, [token]);

  const addToCart = async (productId, quantity) => {
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
    loading, // Expose loading state
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
