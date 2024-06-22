import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Pricing from './components/Pricing';
import Chat from './components/Chat';
import Cancel from './components/Cancel';
import Activate from './components/Activate';
import Profile from './components/Profile';
import { AuthProvider } from './components/AuthContext';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/activate" element={<Activate />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cancel" element={<Cancel />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
