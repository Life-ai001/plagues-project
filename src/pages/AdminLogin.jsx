import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import './Css/AdminLogin.css';

// This would typically come from environment variables in production
const ADMIN_ACCESS_CODE = 'ADMIN2025';

export default function AdminLogin() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!code.trim()) {
            setError('Please enter the access code');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call with a small delay
        setTimeout(() => {
            try {
                if (code === ADMIN_ACCESS_CODE) {
                    // Create a minimal admin user object
                    const adminUser = {
                        _id: 'admin-user',
                        email: 'admin@abs-online.com',
                        firstName: 'Admin',
                        lastName: 'User',
                        isAdmin: true
                    };
                    
                    // Save to localStorage
                    localStorage.setItem('adminToken', 'admin-auth-token');
                    localStorage.setItem('user', JSON.stringify(adminUser));
                    
                    // Redirect to admin dashboard
                    navigate('/admin');
                } else {
                    throw new Error('Invalid access code');
                }
            } catch (err) {
                setError(err.message || 'Access denied. Please try again.');
                console.error('Admin login error:', err);
            } finally {
                setIsLoading(false);
            }
        }, 800); // Simulate network delay
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h1>Admin Login</h1>
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="admin-login-form">
                <div className="admin-logo">
                    <FaLock size={40} />
                    <h2>Admin Access</h2>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <label>Enter Admin Access Code</label>
                    <input 
                        type="password" 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter access code"
                        className="code-input"
                        autoComplete="off"
                        autoFocus
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="login-button" 
                    disabled={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Access Dashboard'}
                </button>
                
                <div className="back-to-home">
                    <a href="/">← Back to Home</a>
                </div>
            </form>
                
                <div className="admin-login-footer">
                    <p>Regular user? <a href="/login">Go to user login</a></p>
                </div>
            </div>
        </div>
    );
}
