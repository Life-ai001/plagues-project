import { createContext, useEffect, useState, useCallback } from "react";
import { getCurrentUser } from "../services/userService";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isBusy, setIsBusy] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setCurrentUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError(err.message || "Failed to load user profile");
      return null;
    }
  }, []);

  const handleLogin = async (userInfo, authToken) => {
    setIsBusy(true);
    try {
      localStorage.setItem("token", authToken);
      // Fetch fresh user data after login
      const userData = await fetchUserProfile();
      if (!userData) {
        throw new Error("Failed to load user profile after login");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      handleLogout();
    } finally {
      setIsBusy(false);
    }
  };

  const handleLogout = () => {
    setIsBusy(true);
    localStorage.clear(); // clears both 'user' and 'token'
    setCurrentUser(null);
    setIsBusy(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      if (storedToken) {
        try {
          await fetchUserProfile();
        } catch (err) {
          console.error("Failed to initialize user session:", err);
          handleLogout();
        }
      } else {
        handleLogout();
      }
      
      setIsBusy(false);
    };

    initializeAuth();
  }, [fetchUserProfile]);

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        setUser: setCurrentUser,
        login: handleLogin,
        logout: handleLogout, // This matches the Profile component's expectation
        loading: isBusy,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
