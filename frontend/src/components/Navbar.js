import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useCart } from '../context/CartContext'; // Import useCart
import { Cart, PersonCircle, Search, House, BoxArrowRight, Sun, Moon, Display, Gear } from 'react-bootstrap-icons';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

import './Navbar.css';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { cart, toggleCart } = useCart();
  const { theme, changeTheme } = useTheme(); // Use the theme context
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
    <nav className="navbar navbar-expand-lg shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">TechLab</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <form className="d-flex me-auto" onSubmit={handleSearchSubmit}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar productos o servicios"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-primary" type="submit"><Search /></button>
          </form>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end><House className="me-1" />Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/products">Productos</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">Servicios</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/projects">Proyectos</NavLink>
            </li>

            {token ? ( // If user is logged in
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
                </li>
                {user && user.role === 'cliente' && (
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      type="button"
                      onClick={toggleCart}
                    >
                      <Cart className="me-1" />
                      ({cartItemCount})
                    </button>
                  </li>
                )}
                <li className="nav-item dropdown">
                  <div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {user && user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <PersonCircle /> // Placeholder icon
                    )}
                  </div>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li><Link className="dropdown-item" to="/profile">Perfil</Link></li>
                    {user && user.role === 'admin' && ( // Admin-specific links
                      <>
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="/admin-panel">Admin Usuarios</Link></li>
                        <li><Link className="dropdown-item" to="/admin-products">Admin Productos</Link></li>
                        <li><Link className="dropdown-item" to="/admin-services">Admin Servicios</Link></li>
                        <li><Link className="dropdown-item" to="/admin-projects">Admin Proyectos</Link></li>
                      </>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li className="dropdown-submenu">
                      <div className="dropdown-item dropdown-toggle">
                        <Gear className="me-1" /> Theme
                      </div>
                      <ul className="dropdown-menu dropdown-menu-end">
                        <li>
                          <button className="dropdown-item" onClick={() => changeTheme('light')}>
                            <Sun className="me-1" /> Claro {theme === 'light' && '✓'}
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={() => changeTheme('dark')}>
                            <Moon className="me-1" /> Oscuro {theme === 'dark' && '✓'}
                          </button>
                        </li>
                        <li>
                          <button className="dropdown-item" onClick={() => changeTheme('system')}>
                            <Display className="me-1" /> Sistema {theme === 'system' && '✓'}
                          </button>
                        </li>
                      </ul>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={logout}><BoxArrowRight className="me-1" />Logout</button></li>
                  </ul>
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
