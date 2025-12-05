import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const Navbar = () => {
  const { token, user, logout } = useAuth(); // Get token, user, and logout function

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">TechLab</Link>
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
