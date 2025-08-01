import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaRegHeart, FaShoppingCart, FaUser, FaSignOutAlt, FaCog, FaUserShield } from 'react-icons/fa';
import { AuthContext } from '../auth/AuthProvider.jsx';
import './Css/Homepage.css';

export default function Homepage() {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [favorites, setFavorites] = useState({});

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '{}');
    setFavorites(savedFavorites);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
    setFavorites(prevFavorites => {
      const newFavorites = { ...prevFavorites };
      if (newFavorites[productId]) {
        delete newFavorites[productId];
      } else {
        newFavorites[productId] = true;
      }
      // Save to localStorage
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // For the navbar background transition effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Add state for dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Sample product data with color placeholders
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 199.99,
      rating: 4.5,
      category: 'Electronics',
      color: '#4a90e2', // Blue
      image: 'https://example.com/premium-headphones.jpg',
      description: 'Experience immersive sound with our premium headphones.'
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 129.99,
      rating: 4.2,
      category: 'Audio',
      color: '#50e3c2' // Teal
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 249.99,
      rating: 4.7,
      category: 'Wearables',
      color: '#f5a623' // Orange
    },
    {
      id: 4,
      name: 'Bluetooth Speaker',
      price: 89.99,
      rating: 4.3,
      category: 'Audio',
      color: '#e74c3c' // Red
    },
    {
      id: 5,
      name: 'Gaming Mouse',
      price: 79.99,
      rating: 4.6,
      category: 'Gaming',
      color: '#9b59b6' // Purple
    }
  ];

  // Fav items data
  const favItems = [
    {
      id: 6,
      name: 'Mechanical Keyboard',
      price: 129.99,
      rating: 4.8,
      category: 'Gaming',
      color: '#2ecc71' // Green
    },
    {
      id: 7,
      name: 'Wireless Mouse',
      price: 59.99,
      rating: 4.4,
      category: 'Accessories',
      color: '#e67e22' // Orange
    },
    {
      id: 8,
      name: 'Noise Cancelling Headphones',
      price: 299.99,
      rating: 4.9,
      category: 'Audio',
      color: '#3498db' // Blue
    },
    {
      id: 9,
      name: 'Smartphone Stand',
      price: 24.99,
      rating: 4.2,
      category: 'Accessories',
      color: '#9b59b6' // Purple
    },
    {
      id: 10,
      name: 'Laptop Backpack',
      price: 89.99,
      rating: 4.7,
      category: 'Accessories',
      color: '#1abc9c' // Teal
    }
  ];

  // Best Selling Products
  const bestSellingProducts = [
    {
      id: 11,
      name: 'Best Selling Product 1',
      price: 99.99,
      rating: 4.8,
      category: 'Electronics',
      color: '#4a90e2', // Blue
    },
    {
      id: 12,
      name: 'Best Selling Product 2',
      price: 79.99,
      rating: 4.6,
      category: 'Audio',
      color: '#50e3c2' // Teal
    },
    {
      id: 13,
      name: 'Best Selling Product 3',
      price: 199.99,
      rating: 4.9,
      category: 'Wearables',
      color: '#f5a623' // Orange
    },
    {
      id: 14,
      name: 'Best Selling Product 4',
      price: 69.99,
      rating: 4.4,
      category: 'Audio',
      color: '#e74c3c' // Red
    },
    {
      id: 15,
      name: 'Best Selling Product 5',
      price: 59.99,
      rating: 4.7,
      category: 'Gaming',
      color: '#9b59b6' // Purple
    }
  ];

  // Combine all products from different sections
  const allProducts = [...featuredProducts, ...favItems, ...bestSellingProducts];
  
  // Get only favorited products from all sections
  const favoritedProducts = allProducts.filter(product => favorites[product.id]);

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className={`nav ${show ? 'nav-black' : ''}`}>
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img 
              src="/vite.svg"
              alt="Logo"
            />
          </Link>
          {user && (
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/browse" className="nav-link">Browse</Link>
              <Link to="/mylist" className="nav-link">My List</Link>
              {user.isAdmin && (
                <Link to="/admin" className="nav-link">Admin Dashboard</Link>
              )}
            </div>
          )}
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
                    onClick={toggleDropdown}
                  />
                  <div className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}>
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>My Profile</Link>
                    <Link to="/account" onClick={() => setIsDropdownOpen(false)}>Account Settings</Link>
                  </div>
                </div>
                <button onClick={handleLogout} className="sign-out-btn" title="Sign Out">
                  <FaSignOutAlt />
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="sign-in-btn">Sign In</Link>
              <Link to="/register" className="sign-up-btn">Sign Up</Link>
              <Link to="/admin/login" className="sign-in-btn" title="Admin Login">
                <FaUserShield />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Banner */}
      <header 
        className="banner"
        style={{
          backgroundImage: `url(${featuredProducts[0].image})`,
          backgroundPosition: 'center center',
          marginTop: '70px' // Add margin to prevent content from being hidden behind the fixed navbar
        }}
      >
        <div className="banner-contents">
          <h1 className="banner-title">{featuredProducts[0].name}</h1>
          <div className="banner-buttons">
            <button className="banner-button">Buy Now</button>
            <button className="banner-button">Learn More</button>
          </div>
          <h1 className="banner-description">
            {featuredProducts[0].description}
          </h1>
        </div>
        <div className="banner-fadeBottom" />
      </header>

      {/* Fav Items Section - Only show if there are favorites */}
      {favoritedProducts.length > 0 && (
        <section className="products-section">
          <h2 className="section-title">Fav Items</h2>
          <div className="products-grid">
            {favoritedProducts.map((product) => (
              <ProductCard 
                key={`fav-${product.id}`} 
                product={product} 
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                showSoldCount={false}
              />
            ))}
          </div>
        </section>
      )}

      {/* Best Selling Products Section */}
      <section className="products-section">
        <h2 className="section-title">Best Selling Products</h2>
        <div className="products-grid">
          {bestSellingProducts.map((product) => (
            <ProductCard 
              key={`best-${product.id}`}
              product={product}
              isFavorite={!!favorites[product.id]}
              onToggleFavorite={toggleFavorite}
              showSoldCount={false}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {allProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isFavorite={!!favorites[product.id]}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// Product Card Component
function ProductCard({ product, isFavorite, onToggleFavorite, showSoldCount = true }) {
  return (
    <div className="product-card">
      <div 
        className="product-image-container" 
        style={{ backgroundColor: product.color }}
      >
        <div className="product-category">{product.category}</div>
        <div className="product-placeholder">
          {product.name.split(' ').map(word => word[0]).join('')}
        </div>
        <button 
          className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
          onClick={(e) => onToggleFavorite(product.id, e)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>
              {i < Math.floor(product.rating) ? '★' : '☆'}
            </span>
          ))}
          <span className="rating-value">{product.rating}</span>
        </div>
        <div className="product-price">${product.price.toFixed(2)}</div>
        {showSoldCount && (
          <div className="product-sold-count">Sold: 100+</div>
        )}
        <button className="add-to-cart-btn">Add to Cart</button>
      </div>
    </div>
  );
}
