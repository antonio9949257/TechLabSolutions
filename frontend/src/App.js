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
import AdminServices from './pages/AdminServices';
import AdminProjects from './pages/AdminProjects'; // Import AdminProjects
import AdminProjectForm from './pages/AdminProjectForm'; // Import AdminProjectForm
import AdminCategories from './pages/AdminCategories'; // Import AdminCategories
import Profile from './pages/Profile';
import Checkout from './pages/Checkout'; // Import Checkout
import SearchResults from './pages/SearchResults'; // Import SearchResults
import ProductDetail from './pages/ProductDetail'; // Import ProductDetail
import ServiceDetail from './pages/ServiceDetail'; // Import ServiceDetail
import Quote from './pages/Quote'; // Import Quote
import Projects from './pages/Projects'; // Import Projects
import ProjectDetail from './pages/ProjectDetail'; // Import ProjectDetail
import CartSidebar from './components/CartSidebar'; // Import CartSidebar
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <CartSidebar />
            <main className="container flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/quote/:serviceId" element={<Quote />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin', 'cliente']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/checkout" element={<Checkout />} />
                </Route>

                {/* Admin-only routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin-panel" element={<AdminPanel />} />
                  <Route path="/admin-products" element={<AdminProducts />} />
                  <Route path="/admin-services" element={<AdminServices />} />
                  <Route path="/admin-projects" element={<AdminProjects />} />
                  <Route path="/admin-project-form" element={<AdminProjectForm />} />
                  <Route path="/admin-project-form/:id" element={<AdminProjectForm />} />
                  <Route path="/admin-categories" element={<AdminCategories />} />
                </Route>

              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
