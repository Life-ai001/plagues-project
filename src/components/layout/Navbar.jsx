import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import { useCart } from '../../contexts/CartContext';
import { FaSearch, FaBell, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src="/vite.svg" alt="Logo" />
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/browse" className="nav-link">Browse</Link>
          <Link to="/mylist" className="nav-link">My List</Link>
        </div>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="user-menu">
            <span className="welcome-text">Welcome, {user.name || 'User'}</span>
            <div className="profile-section">
              <div className="dropdown">
                <img 
                  className="nav-avatar" 
                  src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                  alt="Profile"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="dropdown-content">
                    <Link to="/profile">My Profile</Link>
                    <Link to="/account">Account Settings</Link>
                    <button onClick={handleLogout} className="sign-out-btn">
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
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
