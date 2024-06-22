import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Activate.css';

const Activate = () => {
  const [accountType, setAccountType] = useState('personal'); // Default to 'personal' for testing
  const [corporateDetailCreated, setCorporateDetailCreated] = useState(false); // Default to false for testing
  const [corporateSubscribed, setCorporateSubscribed] = useState(false); // Default to false for testing
  const navigate = useNavigate();
  const { activatePremium } = useAuth();

  const handleActivation = () => {
    // Dummy activation logic for testing
    if (accountType === 'personal') {
      activatePremium(); // Set premium status
      navigate('/profile');
    } else if (!corporateDetailCreated) {
      navigate('/create-corporate-detail');
    } else if (!corporateSubscribed) {
      navigate('/create-subscription');
    } else {
      activatePremium(); // Set premium status
      navigate('/profile');
    }
  };

  return (
    <div className="activate-container">
      <h2>Activate Account</h2>
      <button onClick={handleActivation}>Activate</button>
      <div className="test-controls">
        <h3>Test Controls</h3>
        <div>
          <label>
            Account Type:
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="personal">Personal</option>
              <option value="corporate">Corporate</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Corporate Detail Created:
            <input
              type="checkbox"
              checked={corporateDetailCreated}
              onChange={(e) => setCorporateDetailCreated(e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>
            Corporate Subscribed:
            <input
              type="checkbox"
              checked={corporateSubscribed}
              onChange={(e) => setCorporateSubscribed(e.target.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Activate;
