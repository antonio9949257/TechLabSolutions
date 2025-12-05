import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Services from './pages/Services';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import AdminPanel from './pages/AdminPanel'; // Import AdminPanel
import AdminProducts from './pages/AdminProducts'; // Import AdminProducts
import AdminServices from './pages/AdminServices'; // Import AdminServices
import Profile from './pages/Profile'; // Import Profile
import './App.css';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'cliente']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} /> {/* New Profile Route */}
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/admin-products" element={<AdminProducts />} /> {/* New Admin Products Route */}
              <Route path="/admin-services" element={<AdminServices />} /> {/* New Admin Services Route */}
            </Route>

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
