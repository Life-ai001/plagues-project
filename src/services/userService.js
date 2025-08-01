import apiClient from "../api/api.js";

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err.response?.data || { message: "Failed to fetch users" };
  }
};

// Get current user's profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get("/users/me");
    return response.data;
  } catch (err) {
    console.error('Error fetching current user:', err);
    throw err.response?.data || { message: "Failed to fetch current user" };
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching user ${userId}:`, err);
    throw err.response?.data || { message: "Failed to fetch user" };
  }
};

// Update user profile
export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.patch("/users/me", userData);
    return response.data;
  } catch (err) {
    console.error('Error updating profile:', err);
    throw err.response?.data || { message: "Failed to update profile" };
  }
};

// Update user password
export const updatePassword = async (currentPassword, newPassword) => {
  try {
    const response = await apiClient.patch("/users/me/password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (err) {
    console.error('Error updating password:', err);
    throw err.response?.data || { message: err.message || "Failed to update password" };
  }
};

// Delete a user by ID (admin only)
export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/auth/${id}`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to delete user" };
  }
};

// Upload user profile picture
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await apiClient.post('/auth/upload-profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to upload profile picture" };
  }
};

export default {
  getAllUsers,
  getCurrentUser,
  getUserById,
  updateProfile,
  updatePassword,
  deleteUser,
  uploadProfilePicture,
};
