import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Css/AdminDashboard.css";
import UserList from "../components/UserList";
import ProductList from "../components/admin/ProductList";
import { 
  FaUsers, 
  FaBox, 
  FaChartLine, 
  FaCog, 
  FaSignOutAlt, 
  FaShoppingCart, 
  FaDollarSign, 
  FaUserPlus, 
  FaBoxOpen,
  FaTachometerAlt
} from 'react-icons/fa';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // Default to users tab

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for admin token in localStorage
        const token = localStorage.getItem('adminToken');
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!token || !userData || !userData.isAdmin) {
          navigate("/admin/login");
          return;
        }
        
        setAdminUser(userData);
        setIsLoading(false);
      } catch (err) {
        console.error("Authentication error:", err);
        setError("An error occurred while verifying your permissions.");
        setTimeout(() => navigate("/admin/login"), 2000);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('user');
    navigate("/admin/login");
  };

  const adminFeatures = [
    { 
      title: "Manage Users", 
      description: "View, add, edit, or remove users",
      path: "/admin/users",
      icon: <FaUsers className="feature-icon" />
    },
    { 
      title: "Manage Products", 
      description: "Add, edit, or remove products",
      path: "/admin/products",
      icon: <FaBox className="feature-icon" />
    },
    { 
      title: "Analytics", 
      description: "View site analytics and reports",
      path: "/admin/analytics",
      icon: <FaChartLine className="feature-icon" />
    },
    { 
      title: "Settings", 
      description: "Configure admin settings",
      path: "/admin/settings",
      icon: <FaCog className="feature-icon" />
    },
    { 
      title: "Site Analytics", 
      description: "View site statistics and metrics",
      path: "/admin/analytics",
      icon: <FaChartLine className="feature-icon" />
    }
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="admin-dashboard loading">
          <div className="loading-content">
            <div className="spinner"></div>
            <p>Loading Admin Dashboard...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="admin-dashboard error">
          <div className="error-message">
            <p>{error}</p>
            <p>Redirecting you to the home page...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="admin-dashboard">
        <div className="admin-sidebar">
          <div className="sidebar-header">
            <h2>Admin Panel</h2>
          </div>
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FaTachometerAlt className="nav-icon" />
              <span>Dashboard</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <FaUsers className="nav-icon" />
              <span>User Management</span>
            </button>
            <button 
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <FaBox className="nav-icon" />
              <span>Product Management</span>
            </button>
          </nav>
          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt className="logout-icon" />
              Logout
            </button>
          </div>
        </div>

        <div className="admin-main">
          <header className="admin-header">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'products' && 'Product Management'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <div className="admin-actions">
              <span className="admin-email">{adminUser?.email}</span>
            </div>
          </header>

          <main className="admin-content">
            {error && <div className="error-message">{error}</div>}
            
            {activeTab === 'dashboard' && (
              <>
                <div className="dashboard-stats">
                  <div className="stat-card">
                    <div className="stat-icon users">
                      <FaUsers />
                    </div>
                    <div className="stat-info">
                      <h3>Total Users</h3>
                      <p>1,234</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon products">
                      <FaBox />
                    </div>
                    <div className="stat-info">
                      <h3>Active Products</h3>
                      <p>567</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon orders">
                      <FaShoppingCart />
                    </div>
                    <div className="stat-info">
                      <h3>Today's Orders</h3>
                      <p>89</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon revenue">
                      <FaDollarSign />
                    </div>
                    <div className="stat-info">
                      <h3>Revenue</h3>
                      <p>$12,345</p>
                    </div>
                  </div>
                </div>

                <div className="recent-activity">
                  <h2>Recent Activity</h2>
                  <div className="activity-list">
                    <div className="activity-item">
                      <div className="activity-icon">
                        <FaUserPlus />
                      </div>
                      <div className="activity-details">
                        <p><strong>5 new users</strong> registered today</p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <FaShoppingCart />
                      </div>
                      <div className="activity-details">
                        <p><strong>12 new orders</strong> received</p>
                        <span className="activity-time">4 hours ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon">
                        <FaBoxOpen />
                      </div>
                      <div className="activity-details">
                        <p><strong>3 new products</strong> added</p>
                        <span className="activity-time">6 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'users' && <UserList />}

            {activeTab === 'products' && <ProductList />}


          </main>
        </div>
      </div>
    );
  };

  return renderContent();
}