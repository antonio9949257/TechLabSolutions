import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PersonCircle,
  House,
  BoxArrowRight,
  Sun,
  Moon,
  Display,
  Gear,
  Speedometer2,
  BellFill, // Import BellFill icon
  Receipt, // Import Receipt icon for orders
} from 'react-bootstrap-icons';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext'; // Import useNotifications
import LoginModal from './LoginModal'; // Import LoginModal
import RegisterModal from './RegisterModal'; // Import RegisterModal

const Navbar = ({ toggleUserList, toggleNotificationSidebar, toggleOrderSidebar }) => { // Accept toggleOrderSidebar prop
  const { token, user, logout, showLoginModal, closeLoginModal, openLoginModal, showRegisterModal, closeRegisterModal, openRegisterModal } = useAuth();
  const { theme, changeTheme } = useTheme();
  const { unreadCount } = useNotifications(); // Get unreadCount

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  const handleLoginSuccess = () => {
    // Optionally, perform actions after successful login, e.g., close modals
    closeLoginModal();
    closeRegisterModal();
  };

  const handleRegisterSuccess = () => {
    // Optionally, perform actions after successful registration
    closeRegisterModal();
    // Maybe automatically open login modal after successful registration
    openLoginModal();
  };

  return (
    <nav className="bg-navbar-bg text-navbar-text shadow-md fixed-navbar">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="relative flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-text-primary">
            TechLab
          </Link>

          {/* Mobile Home/Proyectos button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsNavOpen(!isNavOpen)}
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              ☰
            </button>
          </div>

          {/* Desktop Home/Proyectos links */}
          <ul className="hidden lg:flex items-center gap-4">
            <NavLink to="/" className="hover:text-primary">
              <House className="inline mr-1" />
              Home
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/service-history" className="hover:text-primary">
                Historial de Servicios
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="hover:text-primary">
                <Speedometer2 className="inline mr-1" />
                Dashboard
              </NavLink>
            )}
          </ul>

          {/* Profile/Login Section (Always visible on desktop) */}
          <div className="ml-auto lg:ml-4 flex items-center gap-4"> {/* Added flex and gap for spacing */}
            {token ? (
              <>
                {/* Order History Button */}
                <button onClick={toggleOrderSidebar} className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <Receipt className="w-6 h-6" />
                </button>

                {/* Notification Button */}
                <button onClick={toggleNotificationSidebar} className="relative p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <BellFill className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className=""
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
                    <div className="absolute right-0 mt-2 w-48 bg-card-bg shadow-lg rounded z-50 text-text-primary">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-background"
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          setIsNavOpen(false); // Close mobile menu if open
                        }}
                      >
                        Perfil
                      </Link>

                      {user?.role === 'admin' && (
                        <>
                          <hr />
                          <Link
                            to="/admin-users"
                            className="block px-4 py-2 hover:bg-background"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNavOpen(false);
                            }}
                          >
                            Admin Usuarios
                          </Link>
                          <Link
                            to="/admin-products"
                            className="block px-4 py-2 hover:bg-background"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNavOpen(false);
                            }}
                          >
                            Admin Productos
                          </Link>
                          <Link
                            to="/admin-services"
                            className="block px-4 py-2 hover:bg-background"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNavOpen(false);
                            }}
                          >
                            Admin Servicios
                          </Link>
                          <Link
                            to="/admin-service-history"
                            className="block px-4 py-2 hover:bg-background"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNavOpen(false);
                            }}
                          >
                            Admin Historial de Servicios
                          </Link>
                          <Link
                            to="/admin/orders"
                            className="block px-4 py-2 hover:bg-background"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNavOpen(false);
                            }}
                          >
                            Gestionar Pedidos
                          </Link>
                          <Link
                            to="/admin/kits"
                            className="block px-4 py-2 hover:bg-background"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNavOpen(false);
                            }}
                          >
                            Admin Kits
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
                            onClick={() => {
                              changeTheme('light');
                              setIsNavOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-background"
                          >
                            <Sun className="inline mr-1" /> Claro{' '}
                            {theme === 'light' && '✓'}
                          </button>
                          <button
                            onClick={() => {
                              changeTheme('dark');
                              setIsNavOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-background"
                          >
                            <Moon className="inline mr-1" /> Oscuro{' '}
                            {theme === 'dark' && '✓'}
                          </button>
                          <button
                            onClick={() => {
                              changeTheme('system');
                              setIsNavOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-background"
                          >
                            <Display className="inline mr-1" /> Sistema{' '}
                            {theme === 'system' && '✓'}
                          </button>
                        </div>
                      )}

                      <hr />

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileDropdownOpen(false);
                          setIsNavOpen(false);
                        }}
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
              <button
                onClick={openLoginModal}
                className="hover:text-primary"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu Home/Proyectos */}
        {isNavOpen && (
          <ul className="flex flex-col lg:hidden gap-2 mt-2 bg-navbar-bg p-4 shadow-lg absolute top-full left-0 w-full">
            <NavLink to="/" className="hover:text-primary block py-2" onClick={() => setIsNavOpen(false)}>
              <House className="inline mr-1" />
              Home
            </NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/service-history" className="hover:text-primary block py-2" onClick={() => setIsNavOpen(false)}>
                Historial de Servicios
              </NavLink>
            )}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="hover:text-primary block py-2" onClick={() => setIsNavOpen(false)}>
                <Speedometer2 className="inline mr-1" />
                Dashboard
              </NavLink>
            )}
            {!token && (
              <>
                <button
                  onClick={() => { setIsNavOpen(false); openLoginModal(); }}
                  className="hover:text-primary block py-2 text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsNavOpen(false); openRegisterModal(); }}
                  className="hover:text-primary block py-2 text-left"
                >
                  Register
                </button>
              </>
            )}
          </ul>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={closeLoginModal}
          onSuccess={handleLoginSuccess}
          openRegisterModal={openRegisterModal}
        />
      )}
      {showRegisterModal && (
        <RegisterModal
          onClose={closeRegisterModal}
          onSuccess={handleRegisterSuccess}
          openLoginModal={openLoginModal}
        />
      )}
    </nav>
  );
};

export default Navbar;