import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = (props) => {
  return (
    <>
      <nav className={`navbar navbar-dark ${props.color} navbar-expand-sm`}>
        <div className="container">
          <Link to="/" className="navbar-brand">
            <i className="bi bi-stars">{props.header}</i>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
