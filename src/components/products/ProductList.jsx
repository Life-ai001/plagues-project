import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../../services/productService';
import useApi from '../../hooks/useApi';
import { useCart } from '../../contexts/CartContext';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../../styles/global.css';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [addedItems, setAddedItems] = useState({});
  const { addToCart } = useCart();
  const { data, loading, error, callApi } = useApi(getAllProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      const result = await callApi();
      if (result.data) {
        setProducts(result.data.data || []);
      }
    };

    fetchProducts();
  }, [callApi]);

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error loading products: {error}</div>;
  }

  return (
    <div className="container">
      <div className="product-header">
        <h1>Our Products</h1>
        <div className="product-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="sort-options">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="form-control"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="no-products">
          <p>No products found. Try adjusting your search.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="card product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.name} />
                ) : (
                  <div className="image-placeholder">
                    {product.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-meta">
                  <span className="price">${product.price.toFixed(2)}</span>
                  <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <button 
                  className={`add-to-cart-btn ${addedItems[product._id] ? 'added' : ''}`}
                  onClick={() => {
                    addToCart(product);
                    setAddedItems(prev => ({
                      ...prev,
                      [product._id]: true
                    }));
                    
                    toast.success(`${product.name} added to cart!`, {
                      position: "bottom-right",
                      autoClose: 2000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    });
                    
                    // Reset the added state after 2 seconds
                    setTimeout(() => {
                      setAddedItems(prev => ({
                        ...prev,
                        [product._id]: false
                      }));
                    }, 2000);
                  }}
                  disabled={product.stock <= 0}
                >
                  {addedItems[product._id] ? (
                    <>
                      <FaCheck /> Added to Cart
                    </>
                  ) : (
                    <>
                      <FaShoppingCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
