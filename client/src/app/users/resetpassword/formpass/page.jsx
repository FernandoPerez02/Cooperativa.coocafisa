"use client";
import "@public/styles/formusers.css";
import { useEffect, useState } from "react";
import { resetpass } from "@/app/api/auth/passwordService";
import { getToken } from "@/app/api/auth/passwordService";
import AlertPopup from "@/components/common/alert";
import { Loader } from "@/components/common/preloader";

export default function Formresetpass() {
  const [alert, setAlert] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(true);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      setAlert("El token de validación no es válido.");
      return;
    }
    setLoading(true);
    await resetpass(event, setAlert, token);
  };

  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      const isValid = await getToken(setToken, setError, setType, setLoading);
      setTokenValid(isValid);
    };
    validateToken();
  }, []);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <>
      {tokenValid ? (
        <div className="content">
          {showAlert && <AlertPopup message={`La contraseña debe ser mínimo de 8 caracteres
          y máximo de 16. Debe contener al menos una mayúscula, un número y un carácter especial.`}
          type={"alertMessage"} />}
          <header className="flex flex-col items-center">
            <img
              src="/images/Logo.cooperativa.png"
              alt="logo"
              className="w-24 h-24 mb-4 object-contain logo item"
            />
            <h1 className="text-2xl font-bold text-foreground item">Restablecer Contraseña</h1>
          </header>
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="stlvar">
                <label htmlFor="newpass">Nueva Contraseña</label>
                <input type="password" name="newpass" id="newpass" />
              </div>
              <div className="stlvar">
                <label htmlFor="confpass">Confirmar Contraseña</label>
                <input type="password" name="confpass" id="confpass" />
              </div>
              <div className="btn">
                <button type="submit">Restablecer</button>
              </div>
            </form>
            {loading && <Loader alert={alert} type={type}/>}
          </div>
        </div>
      ) : (
        <>
        {loading && <Loader alert={error} type={type}/>}
        </>
      )}
    </>
  );
}
