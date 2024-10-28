"use client";
import { useState, useEffect } from "react";
import Menu from "./navigationmenu";

export default function Header({ menuOptions }) {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 4);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`principal ${isScrolled ? "scrolled" : ""}`}>
      <a href="/home">
        <img
          src="/images/Logo.cooperativa.png"
          alt="logo"
          className="imglogoindex"
        />
      </a>
      <h1>Bienvenido a CoopFinanzas</h1>
      <Menu menuOptions={menuOptions} /> 
      </header>
  );
}

