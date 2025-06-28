import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaShoppingCart,
  FaStore,
  FaClipboardList,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import "../Css/Header.css"; // Create this CSS file for styles

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => setMenuOpen((prev) => !prev);
  const handleClose = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-left">
        <h2>
          T'shirts Design<span>.</span>
        </h2>
        <button
          className="menu-toggle"
          onClick={handleToggle}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={handleClose}>
          <FaHome /> <span>Home</span>
        </Link>
        <Link to="/Shop" onClick={handleClose}>
          <FaStore /> <span>Shop</span>
        </Link>
        <Link to="/Cart" onClick={handleClose}>
          <FaShoppingCart /> <span>Cart</span>
        </Link>
        <Link to="/Request" onClick={handleClose}>
          <FaClipboardList /> <span>Request</span>
        </Link>
        <Link to="/about" onClick={handleClose}>
          <FaInfoCircle /> <span>About</span>
        </Link>
        <Link to="/Dashboard" onClick={handleClose}>
          <FaTachometerAlt /> <span>Dashboard</span>
        </Link>
        <Link to="/Login" onClick={handleClose}>
          <FaSignInAlt /> <span>Login</span>
        </Link>
        <Link to="/Signup" onClick={handleClose}>
          <FaUserPlus /> <span>Signup</span>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
