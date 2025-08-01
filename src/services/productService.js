import apiClient from "../api/api.js";

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch products" };
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: `Failed to fetch product with ID: ${id}` };
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    console.log('Sending product data to server:', productData);
    const response = await apiClient.post("/products", productData);
    console.log('Server response:', response);
    return response.data;
  } catch (err) {
    console.error('Error in createProduct:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      statusText: err.response?.statusText
    });
    throw err.response?.data || { 
      message: "Failed to create product",
      originalError: err.message 
    };
  }
};

// Update a product
export const updateProduct = async (id, productData) => {
  try {
    const response = await apiClient.put(`/products/${id}`, productData);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: `Failed to update product with ID: ${id}` };
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: `Failed to delete product with ID: ${id}` };
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
