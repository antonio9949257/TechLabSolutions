import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Cart,
  PersonCircle,
  Search,
  House,
  BoxArrowRight,
  Sun,
  Moon,
  Display,
  Gear,
} from 'react-bootstrap-icons';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { cart, toggleCart } = useCart();
  const { theme, changeTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const cartItemCount =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsNavOpen(false);
    }
  };

  return (
    <nav className="bg-navbar-bg text-navbar-text shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-text-primary">
            TechLab
          </Link>

          {/* Mobile button */}
          <button
            onClick={() => setIsNavOpen(!isNavOpen)}
            className="lg:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            ☰
          </button>

          {/* Desktop / Mobile Menu */}
          <div
            className={`${
              isNavOpen ? 'block' : 'hidden'
            } lg:flex lg:items-center lg:space-x-6 w-full lg:w-auto`}
          >
            {/* Search */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center my-2 lg:my-0"
            >
              <input
                type="search"
                placeholder="Buscar productos o servicios"
                className="
                  w-full lg:w-64 px-3 py-2 border rounded-l bg-background text-text-primary
                  focus:outline-none focus:ring-2 focus:ring-primary
                "
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-r hover:opacity-90"
              >
                <Search />
              </button>
            </form>

            {/* Links */}
            <ul className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 ml-auto">
              <NavLink className="hover:text-primary" to="/" end>
                <House className="inline mr-1" />
                Home
              </NavLink>

              <NavLink className="hover:text-primary" to="/products">
                Productos
              </NavLink>

              <NavLink className="hover:text-primary" to="/services">
                Servicios
              </NavLink>

              <NavLink className="hover:text-primary" to="/projects">
                Proyectos
              </NavLink>

              {token ? (
                <>
                  <NavLink
                    className="hover:text-primary"
                    to="/dashboard"
                  >
                    Dashboard
                  </NavLink>

                  {user?.role === 'cliente' && (
                    <button
                      onClick={toggleCart}
                      className="hover:text-primary"
                    >
                      <Cart className="inline mr-1" />
                      ({cartItemCount})
                    </button>
                  )}

                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                      className="flex items-center gap-2"
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Perfil"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <PersonCircle className="w-7 h-7" />
                      )}
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-card-bg shadow-lg rounded z-50 text-text-primary">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-background"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Perfil
                        </Link>

                        {user?.role === 'admin' && (
                          <>
                            <hr />
                            <Link
                              to="/admin-panel"
                              className="block px-4 py-2 hover:bg-background"
                            >
                              Admin Usuarios
                            </Link>
                            <Link
                              to="/admin-products"
                              className="block px-4 py-2 hover:bg-background"
                            >
                              Admin Productos
                            </Link>
                            <Link
                              to="/admin-services"
                              className="block px-4 py-2 hover:bg-background"
                            >
                              Admin Servicios
                            </Link>
                            <Link
                              to="/admin-projects"
                              className="block px-4 py-2 hover:bg-background"
                            >
                              Admin Proyectos
                            </Link>
                          </>
                        )}

                        <hr />

                        {/* Theme */}
                        <button
                          onClick={() =>
                            setIsThemeDropdownOpen(!isThemeDropdownOpen)
                          }
                          className="w-full text-left px-4 py-2 hover:bg-background"
                        >
                          <Gear className="inline mr-1" />
                          Tema
                        </button>

                        {isThemeDropdownOpen && (
                          <div className="pl-4">
                            <button
                              onClick={() => changeTheme('light')}
                              className="block w-full text-left px-4 py-2 hover:bg-background"
                            >
                              <Sun className="inline mr-1" /> Claro{' '}
                              {theme === 'light' && '✓'}
                            </button>
                            <button
                              onClick={() => changeTheme('dark')}
                              className="block w-full text-left px-4 py-2 hover:bg-background"
                            >
                              <Moon className="inline mr-1" /> Oscuro{' '}
                              {theme === 'dark' && '✓'}
                            </button>
                            <button
                              onClick={() => changeTheme('system')}
                              className="block w-full text-left px-4 py-2 hover:bg-background"
                            >
                              <Display className="inline mr-1" /> Sistema{' '}
                              {theme === 'system' && '✓'}
                            </button>
                          </div>
                        )}

                        <hr />

                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 hover:bg-background"
                        >
                          <BoxArrowRight className="inline mr-1" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="hover:text-primary"
                >
                  Login
                </Link>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
