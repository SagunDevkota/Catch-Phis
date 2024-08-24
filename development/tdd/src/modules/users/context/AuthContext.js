// import { createContext, useState } from 'react';
// import axios from 'axios';

// const serverUrl = process.env.REACT_APP_CATCHPHIS_SERVER_URL;

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(null);
//   const [errors, setErrors] = useState(null);

//   const login = async (email, password) => {
//     setLoading(true);
//     setErrors(null);

//     try {
//       // http://localhost:5500/127.0.0.1:8000/api/user/token
//       // const response = await axios.post(`${serverUrl}/api/user/token`, {
//       const response = await axios.fetch(
//         'http://127.0.0.1:8000/api/user/token',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ email, password }),
//         }
//       );
//       const data = response.data;
//       if (response.ok) {
//         setUser(data.user);
//         localStorage.setItem('token', data.access);
//       } else {
//         throw new Error(data.message);
//       }
//     } catch (error) {
//       setErrors(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     setUser(null);
//     setErrors(null);
//     localStorage.removeItem('token');
//   };
//   // const register = async (email, first_name, last_name, phone, password, account_type) => {
//   //     setLoading(true);
//   //     setErrors(null);

//   //     try {
//   //         const response = await axios.post(`${serverUrl}/api/user/create`, {
//   //             method: 'POST',
//   //             headers: {
//   //                 'Content-Type': 'application/json'
//   //             },
//   //             body: JSON.stringify({ email, password, first_name, last_name, phone, account_type })
//   //         });
//   //         const data = response.data;
//   //         if(response.ok) {
//   //             setUser(data.user)
//   //             // localStorage.setItem('token', data.access)
//   //         } else {
//   //             throw new Error(data.message);
//   //         }
//   //     } catch (error) {
//   //         setErrors(error.message);
//   //     }
//   //     finally {
//   //         setLoading(false)
//   //     }
//   // }

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading, errors }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Load token from localStorage when the app initializes
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
      const response = await fetch('http://127.0.0.1:8000/api/user/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      console.log('response=', response);
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('token', data.access); // Store token in localStorage
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
      const response = await fetch('http://127.0.0.1:8000/api/user/create/', {
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

        // setToken(data.token);
        // localStorage.setItem('token', data.token); // Store token in localStorage
      } else {
        console.log(data);
        // if (data.password.length > 0) {
        //   console.log(JSON.stringify(data.password));
        //   setErrors(JSON.stringify(data.password));
        // }
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
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      };
    }

    const response = await fetch(url, options);
    return response.json();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, errors, authFetch, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
