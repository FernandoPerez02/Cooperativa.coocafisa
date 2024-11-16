"use client";
import PropTypes from "prop-types";
import { useState } from "react";
import "@public/styles/menu.css";
import { logout } from "@/app/api/auth/authService";

export default function Menu({ menuOptions }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [alert, setAlert] = useState(null);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await logout(event, setAlert);
  };

  return (
    <div className="menu-container">
      <button className="menu-toggle" onClick={toggleMenu} aria-expanded={menuVisible}>
        <i className="bi bi-list"></i>
      </button>
      {menuVisible && (
        <nav className={`menu ${menuVisible ? "visible" : ""}`}>
          <button className="menu-close" onClick={toggleMenu}>
            <i className="bi bi-x-lg"></i>
          </button>
          <ul className="menu-list">
            {menuOptions.map((option) => (
              <li key={option.id} className="menu-item">
                <a href={option.link} className="menu-link">
                  <i className={`menu-icon ${option.icon}`}></i>
                  {option.label}
                </a>
              </li>
            ))}
            <li className="menu-item">
              <form onSubmit={handleSubmit}>
                <button type="submit" className="logout-button">Cerrar Sesión</button>
              </form>
              {alert && <div className="alert">{alert}</div>}
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

Menu.propTypes = {
  menuOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ).isRequired,
};
