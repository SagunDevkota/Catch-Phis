import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState({ username: 'user' }); // Dummy user for testing
    const [isPremiumUser, setIsPremiumUser] = useState(false);

    const login = () => {
        setIsLoggedIn(true);
        setCurrentUser({ username: 'user' }); // Set a dummy user for testing
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setIsPremiumUser(false);
    };

    const activatePremium = () => {
        setIsPremiumUser(true);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, currentUser, isPremiumUser, login, logout, activatePremium }}>
            {children}
        </AuthContext.Provider>
    );
};
