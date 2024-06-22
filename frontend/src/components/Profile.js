import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
// import './Profile.css';

const Profile = () => {
    const { isLoggedIn, currentUser, isPremiumUser } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return null; // Prevent rendering if not logged in
    }

    return (
        <div className="profile-container">
            <h2>Profile</h2>
            <p>Welcome, {currentUser?.username}!</p>
            <p>Status: {isPremiumUser ? 'Premium User' : 'Free User'}</p>
            {!isPremiumUser && (
                <button onClick={() => navigate('/activate')}>Activate Premium</button>
            )}
        </div>
    );
};

export default Profile;
