import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={logo} alt="MediSync" className="navbar-logo" />
        <span className="brand-name">MediSync</span>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/doctor" className="nav-link">Doctor</Link>
        <Link to="/patient" className="nav-link">Patient</Link>
      </div>
    </nav>
  );
};

export default Navbar;
