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
} from 'react-bootstrap-icons';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const { theme, changeTheme } = useTheme();

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

  return (
    <nav className="bg-navbar-bg text-navbar-text shadow-md">
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
            <NavLink to="/projects" className="hover:text-primary">
              Proyectos
            </NavLink>
          </ul>

          {/* Profile/Login Section (Always visible on desktop) */}
          <div className="ml-auto lg:ml-4"> {/* Adjust margin for spacing */}
            {token ? (
              <>
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
                            to="/admin-panel"
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
                            to="/admin-projects"
                            className="block px-4 py-2 hover:bg-background"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsNavOpen(false);
                            }}
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
              <Link
                to="/login"
                className="hover:text-primary"
                onClick={() => setIsNavOpen(false)}
              >
                Login
              </Link>
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
            <NavLink to="/projects" className="hover:text-primary block py-2" onClick={() => setIsNavOpen(false)}>
              Proyectos
            </NavLink>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;