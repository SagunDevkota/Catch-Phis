import React, { useState } from 'react';
import DashboardHome from './DashboardHome';
import DashboardProfile from '../profile/DashboardProfile';
import DashboardLogout from './DashboardLogout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('home');
  const navigate = useNavigate();

  const renderComponent = () => {
    switch (selectedOption) {
      case 'home':
        return <DashboardHome />;
      case 'profile':
        return <DashboardProfile />;
      case 'logout':
        return <DashboardLogout logout={navigateToRoot} />;
      default:
        return <DashboardHome />;
    }
  };

  const navigateToRoot = () => {
    navigate('/');
  };

  return (
    <>
      <div className="container-fluid mt-4">
        <div className="row">
          {/* Sidebar  */}
          <div className="col-3 bg-light">
            <ul className="list-group text-start">
              <li
                className={`list-group-item py-4 ${
                  selectedOption === 'home' ? 'active' : ''
                }`}
                onClick={() => setSelectedOption('home')}
              >
                <i className="bi bi-house m-2"></i>
                Home
              </li>
              <li
                className={`list-group-item py-4 ${
                  selectedOption === 'profile' ? 'active' : ''
                }`}
                onClick={() => setSelectedOption('profile')}
              >
                <i className="bi bi-person-circle m-2"></i>
                Profile
              </li>
              <li
                className={`list-group-item py-4 ${
                  selectedOption === 'live' ? 'active' : ''
                }`}
                onClick={() => setSelectedOption('live')}
              >
                <i className="bi bi-globe m-2"></i>
                Live Status
              </li>
              <li
                className={`list-group-item py-4 ${
                  selectedOption === 'website' ? 'active' : ''
                }`}
                onClick={() => setSelectedOption('website')}
              >
                <i className="bi bi-filter-circle-fill m-2"></i>
                Filtered Website
              </li>
              <li
                className={`list-group-item py-4 ${
                  selectedOption === 'logout' ? 'active' : ''
                }`}
                onClick={() => setSelectedOption('logout')}
              >
                <i className="bi bi-box-arrow-left m-2"></i>
                Logout
              </li>
            </ul>
          </div>
          {/* Main Content  */}
          <div className="col-9">{renderComponent()}</div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
