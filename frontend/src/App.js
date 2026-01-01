import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchNavbar from './components/SearchNavbar'; // Import SearchNavbar
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Services from './pages/Services';
// import Login from './pages/Login'; // Removed
// import Register from './pages/Register'; // Removed
import AuthCallback from './pages/AuthCallback'; // Import AuthCallback
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import AdminUsers from './pages/AdminUsers'; // Import AdminUsers
import Dashboard from './pages/Dashboard'; // Import Dashboard
import AdminProducts from './pages/AdminProducts'; // Import AdminProducts
import AdminServices from './pages/AdminServices';
import AdminServiceHistory from './pages/AdminServiceHistory'; // Import AdminServiceHistory
import AdminServiceHistoryForm from './pages/AdminServiceHistoryForm'; // Import AdminServiceHistoryForm
import AdminCategories from './pages/AdminCategories'; // Import AdminCategories
import AdminOrders from './pages/AdminOrders'; // Import AdminOrders
import AdminBackups from './pages/AdminBackups'; // Import AdminBackups
import AdminCreateKit from './pages/AdminCreateKit'; // Import AdminCreateKit
import AdminKits from './pages/AdminKits'; // Import AdminKits
import Profile from './pages/Profile';
import Checkout from './pages/Checkout'; // Import Checkout
import SearchResults from './pages/SearchResults'; // Import SearchResults
import KitDetail from './pages/KitDetail'; // Import KitDetail
import ProductDetail from './pages/ProductDetail'; // Import ProductDetail
import ServiceDetail from './pages/ServiceDetail'; // Import ServiceDetail
import Quote from './pages/Quote'; // Import Quote
import ServiceHistory from './pages/ServiceHistory'; // Import ServiceHistory
import ServiceHistoryDetail from './pages/ServiceHistoryDetail'; // Import ServiceHistoryDetail
import CartSidebar from './components/CartSidebar'; // Import CartSidebar
import FloatingCartButton from './components/FloatingCartButton'; // Import FloatingCartButton
import FloatingUserListButton from './components/FloatingUserListButton'; // Import FloatingUserListButton
import UserListSidebar from './components/UserListSidebar'; // Import UserListSidebar
import NotificationTray from './components/NotificationTray'; // Import NotificationTray
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SocketProvider } from './context/SocketContext'; // Import SocketProvider
import { NotificationProvider } from './context/NotificationContext'; // Import NotificationProvider

function App() {
  const [activeSidebar, setActiveSidebar] = useState(null); // null, 'cart', 'userlist', or 'notification'

  const toggleSidebar = (sidebar) => {
    setActiveSidebar(current => (current === sidebar ? null : sidebar));
  };

  return (
    <AuthProvider>
      <CartProvider>
        <SocketProvider>
          <NotificationProvider> {/* Wrap with NotificationProvider */}
            <div className="flex flex-col min-h-screen">
                <Navbar toggleNotificationSidebar={() => toggleSidebar('notification')} />
                <SearchNavbar /> {/* Render the new SearchNavbar */}
                <CartSidebar isOpen={activeSidebar === 'cart'} onClose={() => setActiveSidebar(null)} />
                <FloatingCartButton onClick={() => toggleSidebar('cart')} />
                <FloatingUserListButton onClick={() => toggleSidebar('userlist')} />
                <UserListSidebar isOpen={activeSidebar === 'userlist'} onClose={() => setActiveSidebar(null)} />
                <NotificationTray isOpen={activeSidebar === 'notification'} onClose={() => setActiveSidebar(null)} />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/login" element={<Login />} */} {/* Removed */}
                    {/* <Route path="/register" element={<Register />} */} {/* Removed */}
                    <Route path="/auth/callback" element={<AuthCallback />} /> {/* New OIDC callback route */}
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/kits/:id" element={<KitDetail />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:id" element={<ServiceDetail />} />
                    <Route path="/quote/:serviceId" element={<Quote />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/users/:id" element={<Profile />} /> {/* New route for viewing any user's profile */}

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'cliente']} />}>
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/quote/:serviceId" element={<Quote />} /> {/* Now protected */}
                    </Route>

                    {/* Admin-only routes */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                      <Route path="/admin" element={<Dashboard />} /> {/* New admin dashboard route */}
                      <Route path="/admin-users" element={<AdminUsers />} />
                      <Route path="/admin-products" element={<AdminProducts />} />
                      <Route path="/admin-services" element={<AdminServices />} />
                      <Route path="/admin-service-history" element={<AdminServiceHistory />} />
                      <Route path="/admin-service-history-form" element={<AdminServiceHistoryForm />} />
                      <Route path="/admin-service-history-form/:id" element={<AdminServiceHistoryForm />} />
                      <Route path="/admin-categories" element={<AdminCategories />} />
                      <Route path="/admin/orders" element={<AdminOrders />} /> {/* New Admin Orders Route */}
                      <Route path="/admin/backups" element={<AdminBackups />} />
                      <Route path="/admin/create-kit" element={<AdminCreateKit />} />
                      <Route path="/admin/kits" element={<AdminKits />} />
                      {/* Service History routes moved to admin only */}
                      <Route path="/service-history" element={<ServiceHistory />} />
                      <Route path="/service-history/:id" element={<ServiceHistoryDetail />} />
                    </Route>

                  </Routes>
                </main>
                <Footer />
              </div>
            </NotificationProvider>
          </SocketProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;