import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useCart } from '../context/CartContext'; // Import useCart

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { cart, toggleCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">TechLab</Link>

        <form className="d-flex" onSubmit={handleSearchSubmit}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Buscar productos o servicios"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">Buscar</button>
        </form>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Servicios</Link>
            </li>

            {token ? ( // If user is logged in
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                {user && user.role === 'cliente' && (
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      type="button"
                      onClick={toggleCart}
                    >
                      <i className="fas fa-shopping-cart me-1"></i>
                      Carrito ({cartItemCount})
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    {user && user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover', marginRight: '5px' }}
                      />
                    ) : (
                      <i className="fas fa-user-circle me-1"></i> // Placeholder icon
                    )}
                    {user ? user.name : 'Perfil'}
                  </Link>
                </li>
                {user && user.role === 'admin' && ( // Admin-specific links
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-panel">Admin Usuarios</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-products">Admin Productos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin-services">Admin Servicios</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={logout}>Logout</button>
                </li>
              </>
            ) : ( // If user is not logged in
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
