import React from 'react';

import { Link } from 'react-router-dom';

const Home = () => {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  return (
    <>
      <div className="landing">
        <div className="wrapper">
          <div className="d-flex flex-column justify-content-center align-items-center h-100">
            <p className="display-1">Catch Phis</p>
            <div>
              <Link
                className="btn btn-warning btn-lg"
                to={isLoggedIn ? '/users/dashboard' : '/users/login'}
              >
                <i className="bi bi-house-gear-fill bi-lg"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
