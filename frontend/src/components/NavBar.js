import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './NavBar.css';

const NavBar = () => {
    const { isLoggedIn, logout } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-title">
                <h1>CatchPhis</h1>
            </Link>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/chat">Chat</Link></li>
                {isLoggedIn ? (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;
