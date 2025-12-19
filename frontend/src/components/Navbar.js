import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { useCart } from '../context/CartContext'; // Import useCart
import { Cart, PersonCircle, Search, House, BoxArrowRight, Sun, Moon, Display, Gear } from 'react-bootstrap-icons';
import { useTheme } from '../context/ThemeContext'; // Import useTheme

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { cart, toggleCart } = useCart();
  const { theme, changeTheme } = useTheme(); // Use the theme context
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavOpen, setIsNavOpen] = useState(false); // New state for mobile nav
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
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
    <nav className="flex items-center justify-between py-4 shadow-md bg-white">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link className="text-2xl font-bold text-gray-800" to="/">TechLab</Link>

        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <div className={`${isNavOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:w-auto w-full`}>
          <form className="flex-grow flex items-center w-full lg:w-auto my-2 lg:my-0" onSubmit={handleSearchSubmit}>
            <input
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
              type="search"
              placeholder="Buscar productos o servicios"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" type="submit"><Search /></button>
          </form>

          <ul className="flex flex-col lg:flex-row lg:space-x-4 mt-2 lg:mt-0 ml-auto">
            <li className="mb-1 lg:mb-0">
              <NavLink className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded lg:bg-transparent lg:p-0" to="/" end><House className="mr-1" />Home</NavLink>
            </li>
            <li className="mb-1 lg:mb-0">
              <NavLink className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded lg:bg-transparent lg:p-0" to="/products">Productos</NavLink>
            </li>
            <li className="mb-1 lg:mb-0">
              <NavLink className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded lg:bg-transparent lg:p-0" to="/services">Servicios</NavLink>
            </li>
            <li className="mb-1 lg:mb-0">
              <NavLink className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded lg:bg-transparent lg:p-0" to="/projects">Proyectos</NavLink>
            </li>

            {token ? ( // If user is logged in
              <>
                <li className="mb-1 lg:mb-0">
                  <NavLink className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded lg:bg-transparent lg:p-0" to="/dashboard">Dashboard</NavLink>
                </li>
                {user && user.role === 'cliente' && (
                  <li className="mb-1 lg:mb-0">
                    <button
                      className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded lg:bg-transparent lg:p-0 border-0"
                      type="button"
                      onClick={toggleCart}
                    >
                      <Cart className="mr-1" />
                      ({cartItemCount})
                    </button>
                  </li>
                )}
                <li className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none p-2 rounded-md"
                  >
                    {user && user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <PersonCircle className="w-6 h-6" /> // Placeholder icon
                    )}
                  </button>
                  {isProfileDropdownOpen && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                      <li><Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/profile" onClick={() => setIsProfileDropdownOpen(false)}>Perfil</Link></li>
                      {user && user.role === 'admin' && ( // Admin-specific links
                        <>
                          <li><hr className="border-t border-gray-200 my-1" /></li>
                          <li><Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/admin-panel" onClick={() => setIsProfileDropdownOpen(false)}>Admin Usuarios</Link></li>
                          <li><Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/admin-products" onClick={() => setIsProfileDropdownOpen(false)}>Admin Productos</Link></li>
                          <li><Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/admin-services" onClick={() => setIsProfileDropdownOpen(false)}>Admin Servicios</Link></li>
                          <li><Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" to="/admin-projects" onClick={() => setIsProfileDropdownOpen(false)}>Admin Proyectos</Link></li>
                        </>
                      )}
                      <li><hr className="border-t border-gray-200 my-1" /></li>
                      <li className="relative">
                        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}>
                          <Gear className="mr-1" /> Theme
                        </button>
                        {isThemeDropdownOpen && (
                          <ul className="absolute left-full top-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                            <li>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {changeTheme('light'); setIsProfileDropdownOpen(false); setIsThemeDropdownOpen(false);}}>
                                <Sun className="mr-1" /> Claro {theme === 'light' && '✓'}
                              </button>
                            </li>
                            <li>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {changeTheme('dark'); setIsProfileDropdownOpen(false); setIsThemeDropdownOpen(false);}}>
                                <Moon className="mr-1" /> Oscuro {theme === 'dark' && '✓'}
                              </button>
                            </li>
                            <li>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {changeTheme('system'); setIsProfileDropdownOpen(false); setIsThemeDropdownOpen(false);}}>
                                <Display className="mr-1" /> Sistema {theme === 'system' && '✓'}
                              </button>
                            </li>
                          </ul>
                        )}
                      </li>
                      <li><hr className="border-t border-gray-200 my-1" /></li>
                      <li><button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {logout(); setIsProfileDropdownOpen(false);}}>
                        <BoxArrowRight className="mr-1" />Logout
                      </button></li>
                    </ul>
                  )}
                </li>
              </>
            ) : ( // If user is not logged in
              <li className="mb-1 lg:mb-0">
                <Link className="block py-2 px-3 text-gray-700 hover:text-blue-600 rounded lg:bg-transparent lg:p-0" to="/login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
