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

  // Function to generate a random gift card code
  const generateGiftCode = (length = 12) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if ((i + 1) % 4 === 0 && i !== length - 1) {
        result += '-';
      }
    }
    return result;
  };

  // Streaming services data with Unsplash images - prices in NPR (minimum 500)
  const streamingServices = [
    { 
      name: 'Netflix', 
      price: 800, 
      color: '#E50914', 
      category: 'Streaming',
      logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Spotify', 
      price: 650, 
      color: '#1DB954', 
      category: 'Music',
      logo: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Disney+', 
      price: 750, 
      color: '#0063E5', 
      category: 'Streaming',
      logo: 'https://images.unsplash.com/photo-1571847140471-1d9316af9741?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'YouTube Premium', 
      price: 700, 
      color: '#FF0000', 
      category: 'Video',
      logo: 'https://images.unsplash.com/photo-1574717024453-354ddb96d294?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Xbox Game Pass', 
      price: 850, 
      color: '#107C10', 
      category: 'Gaming',
      logo: 'https://images.unsplash.com/photo-1605901309571-3f9f1b3b5f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Apple Music', 
      price: 600, 
      color: '#FC3C44', 
      category: 'Music',
      logo: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Amazon Prime Video', 
      price: 750, 
      color: '#00A8E1', 
      category: 'Streaming',
      logo: 'https://images.unsplash.com/photo-1600028068383-ea11a7a101f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'HBO Max', 
      price: 900, 
      color: '#821BF0', 
      category: 'Streaming',
      logo: 'https://images.unsplash.com/photo-1536440136628-709d9b1f4f1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Twitch Prime', 
      price: 800, 
      color: '#9146FF', 
      category: 'Gaming',
      logo: 'https://images.unsplash.com/photo-1593305844261-1e338b9e5b8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Crunchyroll', 
      price: 700, 
      color: '#F78C25', 
      category: 'Anime',
      logo: 'https://images.unsplash.com/photo-1574375927931-d7a34fda38f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Nintendo eShop', 
      price: 1000, 
      color: '#E60012', 
      category: 'Gaming',
      logo: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'PlayStation Plus', 
      price: 950, 
      color: '#003791', 
      category: 'Gaming',
      logo: 'https://images.unsplash.com/photo-1605901309571-3f9f1b3b5f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Hulu', 
      price: 750, 
      color: '#1CE783', 
      category: 'Streaming',
      logo: 'https://images.unsplash.com/photo-1560769629-975ea94ef5e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Deezer', 
      price: 650, 
      color: '#FEAA2D', 
      category: 'Music',
      logo: 'https://images.unsplash.com/photo-1505740429388-9c8f0c4b34b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    { 
      name: 'Steam', 
      price: 1000, 
      color: '#1A9FFF', 
      category: 'Gaming',
      logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  // Generate gift card products
  const generateGiftCards = (count, startId = 1) => {
    return Array.from({ length: count }, (_, i) => {
      const service = streamingServices[Math.floor(Math.random() * streamingServices.length)];
      const code = generateGiftCode();
      return {
        id: startId + i,
        name: `${service.name} Gift Card`,
        price: service.price,
        rating: (Math.random() * 0.6 + 4.2).toFixed(1) * 1, // Random rating between 4.2 and 4.8
        category: service.category,
        color: service.color,
        service: service.name,
        code: code,
        description: `Redeem this code for ${service.name} subscription. Code: ${code}`,
        isGiftCard: true
      };
    });
  };

  // Featured gift cards
  const featuredProducts = generateGiftCards(5, 1);
  
  // Favorite gift cards
  const favItems = generateGiftCards(5, 6);
  
  // Best selling gift cards
  const bestSellingProducts = generateGiftCards(5, 11);

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
              <Link to="/checkout" className="nav-link">Cart</Link>
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

      {/* Featured Products Section - Limited to 6 items */}
      <section className="products-section">
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {allProducts.slice(0, 6).map((product) => (
            <ProductCard 
              key={`featured-${product.id}`}
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
  const [showCode, setShowCode] = useState(false);
  
  return (
    <div className="product-card">
      <div 
        className="product-image-container" 
        style={{ backgroundColor: product.color || '#f0f0f0' }}
      >
        <div className="product-category">{product.category}</div>
        <div className="product-logo-container">
          {product.logo ? (
            <img 
              src={product.logo} 
              alt={product.service || product.name} 
              className="service-logo"
              onError={(e) => {
                // Fallback to text if image fails to load
                e.target.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'product-placeholder';
                placeholder.textContent = product.service 
                  ? product.service.split(' ').map(word => word[0]).join('')
                  : product.name.split(' ').map(word => word[0]).join('');
                e.target.parentNode.appendChild(placeholder);
              }}
            />
          ) : (
            <div className="product-placeholder">
              {product.service 
                ? product.service.split(' ').map(word => word[0]).join('')
                : product.name.split(' ').map(word => word[0]).join('')
              }
            </div>
          )}
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
        <h3 className="product-name">
          {product.service || product.name}
        </h3>
        
        {product.code && (
          <div className="gift-code-container" onClick={() => setShowCode(!showCode)}>
            <div className={`gift-code ${showCode ? 'revealed' : ''}`}>
              {showCode ? (
                <span className="code">{product.code}</span>
              ) : (
                <span className="code-placeholder">•••• •••• •••• ••••</span>
              )}
              <span className="reveal-text">
                {showCode ? 'Hide Code' : 'Click to Reveal'}
              </span>
            </div>
          </div>
        )}
        
        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>
              {i < Math.floor(product.rating) ? '★' : '☆'}
            </span>
          ))}
          <span className="rating-value">{product.rating}</span>
        </div>
        
        <div className="product-price">NPR {Math.round(product.price)}</div>
        
        {showSoldCount && (
          <div className="product-sold-count">
            {Math.floor(Math.random() * 100) + 50}+ sold this month
          </div>
        )}
        
        <button className="add-to-cart-btn">
          {product.isGiftCard ? 'Buy Now' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
