import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaHome, FaBox, FaList } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          Abs-Online
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/" className="nav-link">
          <FaHome className="nav-icon" /> Home
        </Link>
        <Link to="/products" className="nav-link">
          <FaBox className="nav-icon" /> Products
        </Link>
        <Link to="/checkout" className="nav-link">
          <FaList className="nav-icon" /> My List ({cartCount})
        </Link>
      </div>

      <div className="navbar-actions">
        {user ? (
          <>
            <Link to="/profile" className="nav-link">
              <FaUser className="nav-icon" /> {user.name || 'Profile'}
            </Link>
            {user.isAdmin && (
              <Link to="/admin" className="nav-link">
                Admin Dashboard
              </Link>
            )}
            <button onClick={handleLogout} className="nav-link">
              <FaSignOutAlt className="nav-icon" /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
