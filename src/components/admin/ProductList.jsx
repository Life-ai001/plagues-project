import React, { useState, useEffect } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaPlus,
  FaSearch,
  FaSync,
  FaExclamationTriangle
} from 'react-icons/fa';
import { 
  getAllProducts, 
  updateProduct, 
  deleteProduct, 
  createProduct 
} from '../../services/productService';
import '../../pages/Css/UserListPage.css';

const ProductList = () => {
  const [products, setProducts] = useState([
    // Mock product that will be shown by default
    {
      _id: 'mock-product-1',
      name: 'Sample Product',
      description: 'This is a sample product. Add your first product to see it here!',
      price: 19.99,
      stock: 10,
      category: 'Sample',
      image: 'https://via.placeholder.com/100',
      isMock: true // Flag to identify mock products
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setRefreshing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    image: ''
  });

  const fetchProducts = async () => {
    try {
      setError(null);
      setRefreshing(true);
      const response = await getAllProducts();
      // Only update if we have real products, otherwise keep the mock data
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // Don't show error if we have the mock product
      if (products.length === 0 || products[0].isMock) {
        setError('Failed to load products. Working in offline mode.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRefresh = () => {
    fetchProducts();
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({ ...product });
  };

  const handleSave = async (id) => {
    try {
      await updateProduct(id, editData);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    }
  };

  const handleDelete = async (id, isMock = false) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    // Remove the product from the UI immediately
    setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
    
    // If it's not a mock product, try to delete from the server
    if (!isMock) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error('Error deleting product:', err);
        // If deletion fails, show an error but don't add it back to the list
        setError('Warning: Product was removed from the list but may still exist on the server.');
      }
    }
  };

  const handleAddProduct = async () => {
    // Generate a temporary ID for the new product
    const tempId = `temp-${Date.now()}`;
    const newProductWithId = {
      ...newProduct,
      _id: tempId,
      isMock: true // Mark as mock until confirmed from server
    };

    // Add the new product to the list immediately
    setProducts(prevProducts => [newProductWithId, ...prevProducts]);
    
    // Close the add form
    setIsAdding(false);
    
    // Reset the form
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: ''
    });
    
    try {
      // Try to save to the backend
      console.log('Attempting to create product with data:', newProductWithId);
      const response = await createProduct(newProduct);
      console.log('Product creation response:', response);
      
      if (!response) {
        throw new Error('No response received from server');
      }
      
      if (response.error) {
        throw new Error(response.message || 'Failed to add product');
      }
      
      // If successful, update the product with the real ID from the server
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p._id === tempId ? { ...response.data, isMock: false } : p
        )
      );
      
      // Show success message
      setError(null);
    } catch (err) {
      console.error('Error adding product:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to sync with server. Changes are local only.';
      
      // Keep the product in the list but mark it as not synced
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p._id === tempId ? { ...p, syncError: errorMessage } : p
        )
      );
      
      setError(`Warning: ${errorMessage}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const filteredProducts = products.filter(product => {
    // Always show mock products
    if (product.isMock) return true;
    
    // Filter based on search term
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      (product.description || '').toLowerCase().includes(searchLower) ||
      (product.category || '').toLowerCase().includes(searchLower)
    );
  });

  if (loading && !isRefreshing) {
    return (
      <div className="loading">
        <div className="skeleton" style={{ width: '100%', height: '100px', marginBottom: '10px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '100px', marginBottom: '10px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '100px' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <FaExclamationTriangle className="error-icon" />
        <p>{error}</p>
        <button onClick={fetchProducts} className="refresh-button">
          <FaSync /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>Product Management</h2>
        <div className="user-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="user-count">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="add-button"
            title="Add New Product"
          >
            <FaPlus /> Add Product
          </button>
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={isRefreshing}
            title="Refresh products"
          >
            <FaSync className={isRefreshing ? 'spinning' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="add-product-form">
          <h3>Add New Product</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={newProduct.name}
                onChange={handleNewProductChange}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                className="form-control"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={newProduct.stock}
                onChange={handleNewProductChange}
                className="form-control"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={newProduct.category}
                onChange={handleNewProductChange}
                className="form-control"
              />
            </div>
            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                className="form-control"
                rows="3"
              />
            </div>
            <div className="form-group full-width">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={newProduct.image}
                onChange={handleNewProductChange}
                className="form-control"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <div className="form-actions">
            <button 
              onClick={handleAddProduct}
              className="save-button"
              disabled={!newProduct.name || !newProduct.price}
            >
              Save Product
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="user-list">
        <div className="user-list-header">
          <div className="user-list-cell">Product</div>
          <div className="user-list-cell">Description</div>
          <div className="user-list-cell">Price</div>
          <div className="user-list-cell">Stock</div>
          <div className="user-list-cell">Category</div>
          <div className="user-list-cell actions">Actions</div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <FaSearch size={48} />
            <h3>No products found</h3>
            <p>Try adjusting your search or add a new product.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product._id} className="user-list-row">
              {editingId === product._id ? (
                <>
                  <div className="user-list-cell">
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="user-list-cell">
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="user-list-cell">
                    <input
                      type="number"
                      name="price"
                      value={editData.price}
                      onChange={handleChange}
                      className="edit-input"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="user-list-cell">
                    <input
                      type="number"
                      name="stock"
                      value={editData.stock}
                      onChange={handleChange}
                      className="edit-input"
                      min="0"
                    />
                  </div>
                  <div className="user-list-cell">
                    <input
                      type="text"
                      name="category"
                      value={editData.category || ''}
                      onChange={handleChange}
                      className="edit-input"
                    />
                  </div>
                  <div className="user-list-cell actions">
                    <button 
                      onClick={() => handleSave(product._id)}
                      className="action-btn save"
                      title="Save"
                    >
                      <FaCheck />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="action-btn cancel"
                      title="Cancel"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="user-list-cell" data-label="Product">
                    <div className="product-name">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="product-thumbnail"
                        />
                      )}
                      {product.name}
                    </div>
                  </div>
                  <div className="user-list-cell" data-label="Description">
                    {product.description?.length > 50 
                      ? `${product.description.substring(0, 50)}...` 
                      : product.description}
                  </div>
                  <div className="user-list-cell" data-label="Price">
                    ${product.price?.toFixed(2)}
                  </div>
                  <div className="user-list-cell" data-label="Stock">
                    <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock}
                    </span>
                  </div>
                  <div className="user-list-cell" data-label="Category">
                    {product.category || 'N/A'}
                  </div>
                  <div className="user-list-cell actions">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="action-btn edit"
                      title="Edit Product"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDelete(product._id, product.isMock)}
                      className="action-btn delete"
                      title="Delete Product"
                      disabled={product.isMock && products.length === 1} // Don't allow deleting the last mock product
                    >
                      <FaTrash />
                    </button>
                    {product.syncError && (
                      <span className="sync-error" title={product.syncError}>
                        <FaExclamationTriangle />
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .add-product-form {
          background: #f8fafc;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .add-product-form h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #1a237e;
          font-size: 1.25rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group.full-width {
          grid-column: 1 / -1;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #4a5568;
        }
        
        .form-control {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .form-control:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .save-button, .cancel-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .save-button {
          background-color: #4f46e5;
          color: white;
          border: 1px solid #4f46e5;
        }
        
        .save-button:hover:not(:disabled) {
          background-color: #4338ca;
          border-color: #4338ca;
        }
        
        .save-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .cancel-button {
          background-color: #f1f5f9;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }
        
        .cancel-button:hover {
          background-color: #e2e8f0;
        }
        
        .product-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .product-thumbnail {
          width: 36px;
          height: 36px;
          object-fit: cover;
          border-radius: 4px;
        }
        
        .stock-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .stock-badge.in-stock {
          background-color: #dcfce7;
          color: #166534;
        }
        
        .stock-badge.out-of-stock {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .add-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .add-button:hover {
          background-color: #4338ca;
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .product-name {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .product-thumbnail {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductList;
