import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'bootstrap';

const CartSidebar = () => {
  const { cart, loading, removeFromCart, updateCartItem, isCartOpen, closeCart } = useCart();
  const offcanvasRef = useRef(null);
  const offcanvasInstance = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (offcanvasRef.current) {
      offcanvasInstance.current = new Offcanvas(offcanvasRef.current, { backdrop: false, scroll: true });
      // Hide the offcanvas when the component unmounts
      return () => {
        if (offcanvasInstance.current) {
          // No direct destroy method, but we can hide it
          offcanvasInstance.current.hide();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (offcanvasInstance.current) {
      if (isCartOpen) {
        offcanvasInstance.current.show();
      } else {
        offcanvasInstance.current.hide();
      }
    }
  }, [isCartOpen]);

  // Add an event listener to the offcanvas to update the context state when it's closed
  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;
    if (offcanvasElement) {
      const handleHide = () => {
        closeCart();
      };
      offcanvasElement.addEventListener('hidden.bs.offcanvas', handleHide);
      return () => {
        offcanvasElement.removeEventListener('hidden.bs.offcanvas', handleHide);
      };
    }
  }, [closeCart]);


  const handleQuantityChange = (productId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (newQuantity > 0) {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewProducts = () => {
    closeCart();
    navigate('/products');
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="cartSidebar"
      aria-labelledby="cartSidebarLabel"
      ref={offcanvasRef}
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="cartSidebarLabel">
          Tu Carrito
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : cart && cart.items.length > 0 ? (
          <>
            <ul className="list-group list-group-flush">
              {cart.items.map((item) => (
                <li key={item.product._id} className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <div>
                      <h6 className="mb-1">{item.product.name}</h6>
                      <small>Cantidad: {item.quantity}</small>
                    </div>
                    <span className="text-muted">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="d-flex align-items-center mt-2">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product._id, e.target.value)}
                      min="1"
                      style={{ width: '60px' }}
                    />
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <h4>Total: ${cart.totalPrice.toFixed(2)}</h4>
              <button onClick={handleCheckout} className="btn btn-success w-100">
                Proceder al Pago
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p>Tu carrito está vacío.</p>
            <button onClick={handleViewProducts} className="btn btn-primary">
              Ver Productos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
