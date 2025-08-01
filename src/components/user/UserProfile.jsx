import React, { useEffect, useState, useCallback } from 'react';
import { getCurrentUser, updateProfile, uploadProfilePicture } from '../../services/userService';
import useApi from '../../hooks/useApi';
import '../../styles/global.css';
import './UserProfile.css';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePicture: null,
    previewUrl: '',
  });

  const { data: userData, loading: userLoading, error: userError, callApi: fetchUser } = useApi(getCurrentUser);
  const { loading: updateLoading, error: updateError, callApi: updateUser } = useApi(updateProfile);
  const { loading: uploadLoading, error: uploadError, callApi: uploadPicture } = useApi(uploadProfilePicture);

  useEffect(() => {
    const loadUserProfile = async () => {
      const result = await fetchUser();
      if (result.data) {
        const { name, email, profilePicture } = result.data.data;
        setFormData(prev => ({
          ...prev,
          name,
          email,
          previewUrl: profilePicture || ''
        }));
      }
    };

    loadUserProfile();
  }, [fetchUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First update the profile data
      if (formData.name || formData.email) {
        await updateUser({
          name: formData.name,
          email: formData.email,
        });
      }

      // Then upload the profile picture if a new one was selected
      if (formData.profilePicture) {
        await uploadPicture(formData.profilePicture);
      }

      // Refresh user data
      await fetchUser();
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (userLoading) {
    return <div>Loading user profile...</div>;
  }

  if (userError) {
    return <div className="error">Error: {userError}</div>;
  }

  if (userLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (userError) {
    return <div className="error-message">Error loading profile: {userError}</div>;
  }

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p className="member-since">Member since {new Date(userData?.data?.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="profile-picture-container">
              <div className="profile-picture">
                {formData.previewUrl ? (
                  <img 
                    src={formData.previewUrl} 
                    alt="Profile" 
                    className="profile-image"
                  />
                ) : (
                  <div className="default-avatar">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label 
                  htmlFor="profile-picture"
                  className={`change-photo-btn ${uploadLoading ? 'uploading' : ''}`}
                >
                  {uploadLoading ? (
                    <span className="upload-spinner"></span>
                  ) : (
                    <>
                      <i className="fas fa-camera"></i>
                      <span>Change Photo</span>
                    </>
                  )}
                </label>
              </div>
              <div className="user-role">
                <span className={`role-badge ${userData?.data?.isAdmin ? 'admin' : 'user'}`}>
                  {userData?.data?.isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Enter your location"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="4"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>

              {(updateError || uploadError) && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {updateError || uploadError}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={updateLoading || uploadLoading}
                  className="btn btn-primary save-button"
                >
                  {updateLoading || uploadLoading ? (
                    <>
                      <span className="spinner-button"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                
                <button 
                  type="button" 
                  className="btn btn-outline cancel-button"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
