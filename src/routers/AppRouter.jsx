import React, { useContext, Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthProvider.jsx';
import { CartProvider } from '../contexts/CartContext';
import Navbar from '../components/layout/Navbar';

// Lazy load components for better performance
const Homepage = lazy(() => import('../pages/Homepage.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const AdminLogin = lazy(() => import('../pages/AdminLogin.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));
const PostPage = lazy(() => import('../pages/postPage.jsx'));
const UserListPage = lazy(() => import('../pages/UserListPage.jsx'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard.jsx'));
const Profile = lazy(() => import('../pages/Profile.jsx'));
const ProductList = lazy(() => import('../components/products/ProductList.jsx'));
const UserProfile = lazy(() => import('../components/user/UserProfile.jsx'));
const CartPage = lazy(() => import('../pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage.jsx'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

export default function AppRouter() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register', '/admin/login'];
  const isNoLayout = noLayoutRoutes.includes(location.pathname);
  const { user } = useContext(AuthContext);

  if (isNoLayout) {
    return (
      <div className="app-container no-layout">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
            <Route path="/admin/login" element={!user ? <AdminLogin /> : <Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="app-container default-layout">
        {/* Navbar removed as per user request */}
      <main className="main-content">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route
              path="/"
              element={user ? <Homepage /> : <Navigate to="/login" replace />}
            />
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/register" 
              element={!user ? <Register /> : <Navigate to="/" replace />} 
            />
            <Route 
              path="/admin/login" 
              element={!user ? <AdminLogin /> : <Navigate to="/admin" replace />} 
            />

            {/* Profile Routes */}
            <Route
              path="/profile"
              element={user ? <UserProfile /> : <Navigate to="/login" replace />}
            />

            {/* Products Routes */}
            <Route
              path="/products"
              element={user ? <ProductList /> : <Navigate to="/login" replace />}
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                user && user.isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              }
            />

            {/* Cart and Checkout Routes */}
            <Route
              path="/cart"
              element={user ? <CartPage /> : <Navigate to="/login" replace />}
            />
            
            <Route
              path="/checkout"
              element={user ? <CheckoutPage /> : <Navigate to="/login" replace />}
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
    </CartProvider>
  );
};
