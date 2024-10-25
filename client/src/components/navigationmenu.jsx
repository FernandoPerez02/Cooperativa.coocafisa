"use client";
import PropTypes from "prop-types";
import { useState } from "react";

export default function Menu({ options }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  return (
    <div className="menu">
      <button
        className="abrmenu"
        onClick={toggleMenu}
        aria-expanded={menuVisible}
      >
        <i className="bi bi-list"></i>
      </button>
      <nav className={`nav ${menuVisible ? "visible" : ""}`}>
        <button className="crrmenu" onClick={toggleMenu}>
          <i className="bi bi-x-lg"></i>
        </button>
        <ul className="nav_list">
          {options.map((option) => (
            <li key={option.id}>
              <a href={option.link}>{option.label}</a>
            </li>
          ))}
          <li>
            <form action="/logout" method="post">
              <button type="submit" className="btn_salir">
                Cerrar Sesión
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </div>
  );
}

Menu.propTypes= {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      })
    ).isRequired,
  };
