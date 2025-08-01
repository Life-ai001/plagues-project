import React, { useState, useEffect } from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaExclamationTriangle, 
  FaUserPlus,
  FaSearch,
  FaSync
} from 'react-icons/fa';
import '../pages/Css/UserListPage.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = async () => {
    try {
      setError(null);
      setIsRefreshing(true);
      
      // Simulate API call with timeout
      const mockUsers = await new Promise((resolve) => {
        setTimeout(() => {
          const mockData = [
            { 
              id: 1, 
              name: 'John Doe', 
              email: 'john@example.com', 
              role: 'user', 
              status: 'active',
              joinDate: '2023-01-15',
              lastLogin: '2023-04-10T14:30:00Z'
            },
            { 
              id: 2, 
              name: 'Jane Smith', 
              email: 'jane@example.com', 
              role: 'admin', 
              status: 'active',
              joinDate: '2022-11-05',
              lastLogin: '2023-04-11T09:15:00Z'
            },
            { 
              id: 3, 
              name: 'Bob Johnson', 
              email: 'bob@example.com', 
              role: 'user', 
              status: 'inactive',
              joinDate: '2023-02-20',
              lastLogin: '2023-03-28T16:45:00Z'
            },
          ];
          resolve(mockData);
        }, 800);
      });
      
      setUsers(mockUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleRefresh = () => {
    fetchUsers();
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleStatusToggle = (userId) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' } 
        : user
    ));
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditData({ ...user });
  };

  const handleSave = (id) => {
    // In a real app, you would make an API call to update the user
    setUsers(users.map(user => 
      user.id === id ? { ...editData } : user
    ));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
        <button onClick={fetchUsers} className="refresh-button">
          <FaSync /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>User Management</h2>
        <div className="user-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="user-count">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'User' : 'Users'}
          </div>
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={isRefreshing}
            title="Refresh users"
          >
            <FaSync className={isRefreshing ? 'spinning' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="user-list">
        <div className="user-list-header">
          <div className="user-list-cell">Name</div>
          <div className="user-list-cell">Email</div>
          <div className="user-list-cell">Role</div>
          <div className="user-list-cell">Status</div>
          <div className="user-list-cell actions">Actions</div>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <FaSearch size={48} />
            <h3>No users found</h3>
            <p>Try adjusting your search or add a new user.</p>
          </div>
        ) : (
          filteredUsers.map(user => (
          <div key={user.id} className="user-list-row">
            {editingId === user.id ? (
              <>
                <div className="user-list-cell">
                  <input
                    type="text"
                    name="name"
                    value={editData.name || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                </div>
                <div className="user-list-cell">
                  <input
                    type="email"
                    name="email"
                    value={editData.email || ''}
                    onChange={handleChange}
                    className="edit-input"
                  />
                </div>
                <div className="user-list-cell">
                  <select
                    name="role"
                    value={editData.role || 'user'}
                    onChange={handleChange}
                    className="edit-select"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div className="user-list-cell">
                  <select
                    name="status"
                    value={editData.status || 'active'}
                    onChange={handleChange}
                    className="edit-select"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="user-list-cell actions">
                  <button 
                    onClick={() => handleSave(user.id)}
                    className="action-btn save"
                    title="Save"
                  >
                    <FaCheck />
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="action-btn cancel"
                    title="Cancel"
                  >
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="user-list-cell">{user.name}</div>
                <div className="user-list-cell">{user.email}</div>
                <div className="user-list-cell">
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </div>
                <div className="user-list-cell">
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={user.status === 'active'}
                      onChange={() => handleStatusToggle(user.id)}
                    />
                    <span className="slider round"></span>
                  </label>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </div>
                <div className="user-list-cell actions">
                  <button 
                    onClick={() => handleEdit(user)}
                    className="action-btn edit"
                    title="Edit User"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete"
                    title="Delete User"
                  >
                    <FaTrash />
                  </button>
                </div>
              </>
            )}
          </div>
          ))
        )}
      </div>
      
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 20px;
          margin-right: 10px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 20px;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        input:checked + .slider {
          background-color: #10b981;
        }
        
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .user-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          color: #9ca3af;
        }
        
        .search-input {
          padding: 8px 12px 8px 36px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          width: 250px;
          font-size: 14px;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .refresh-button {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .refresh-button:hover {
          background: #e5e7eb;
        }
        
        .refresh-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default UserList;
