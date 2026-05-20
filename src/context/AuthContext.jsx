// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/auth';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   useEffect(() => {
//     if (token) {
//       const userData = getCurrentUser();
//       setUser(userData);
//     }
//     setLoading(false);
//   }, [token]);

//   const login = async (email, password) => {
//     try {
//       const response = await apiLogin(email, password);
//       const { token, user } = response;
      
//       localStorage.setItem('token', token);
//       setToken(token);
//       setUser(user);
      
//       return { success: true, user };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   };

//   const logout = () => {
//     apiLogout();
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//   };

//   const hasRole = (roles) => {
//     if (!user) return false;
//     return roles.includes(user.role);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     logout,
//     hasRole,
//     isAuthenticated: !!user,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };  




import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  login as apiLogin,
  logout as apiLogout,
  getCurrentUser
} from '../services/auth';
import axiosInstance from '../services/AxiosInstance';

const AuthContext = createContext();

export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const location = useLocation();

  useEffect(() => {

    const checkAuth = async () => {

      if (!token) {
        setLoading(false);
        return;
      }

      try {

        const response = await axiosInstance.get("/checktoken");
        // console.log("ressss",response)
        const apiRole = response.data.role;

        const userData = getCurrentUser();
        // console.log("haha",userData)
        // console.log("apirole",apiRole)
        if (userData && apiRole === userData.role) {

          setUser(userData);
          setIsAuthenticated(true);

        } else {

          localStorage.clear();

          setUser(null);
          setIsAuthenticated(false);

        }

      } catch (error) {

        localStorage.clear();

        setUser(null);
        setIsAuthenticated(false);

      } finally {

        setLoading(false);

      }
    };

    checkAuth();

  }, [token,location.pathname]);

  const login = async (email, password) => {

    try {

      const response = await apiLogin(email, password);

      const { token, user } = response;

      localStorage.setItem('token', token);

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);

      return {
        success: true,
        user
      };

    } catch (error) {

      return {
        success: false,
        error: error.message
      };

    }
  };

  const logout = () => {

    apiLogout();

    localStorage.removeItem('token');

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

  };

  const hasRole = (roles) => {

    if (!user) return false;

    return roles.includes(user.role);

  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};