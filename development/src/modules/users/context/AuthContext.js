import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setErrors(null);
    try {
      const response = await fetch(`${serverUrl}/api/user/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.access);
        setIsAuthenticated(true);
      } else {
        setErrors(data.detail);
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email,
    password,
    first_name,
    last_name,
    phone,
    account_type
  ) => {
    setLoading(true);
    setErrors(null);
    try {
      const response = await fetch(`${serverUrl}/api/user/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name,
          last_name,
          phone,
          password,
          account_type,
        }),
      });
      const data = await response.json();
      if (response.status === 201) {
        setUser(data.user);
      } else {
        if (data.password) {
          setErrors(JSON.stringify(data.password));
        }
        if (data.email) {
          setErrors(JSON.stringify(data.email));
        }
      }
    } catch (error) {
      setErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setErrors(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const authFetch = async (url, options = {}) => {
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(url, options);
    return response.json();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        errors,
        authFetch,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
