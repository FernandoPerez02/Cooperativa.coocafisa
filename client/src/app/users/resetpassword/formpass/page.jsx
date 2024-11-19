"use client";
import "@public/styles/formusers.css";
import { useEffect, useState } from "react";
import { resetpass } from "@/app/api/auth/passwordService";
import { getToken } from "@/app/api/auth/passwordService";
import AlertPopup from "@/components/common/alert";

export default function Formresetpass() {
  const [alert, setAlert] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [token, setToken] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Verifica si el token es válido antes de enviar el formulario
    if (!token) {
      setAlert("El token de validación no es válido.");
      return;
    }
    // Pasa el token junto con el formulario
    await resetpass(event, setAlert, token);
    console.log("Token enviado al backend: ", token);
  };

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await getToken(setToken, setError);
      console.log("Estado de token de validación: ", isValid);
      setTokenValid(isValid);
    };
    validateToken();
    handleAlert();
  }, []);

  const handleAlert = () => {
    setShowAlert(true);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      {tokenValid ? (
        <div className="content">
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
              {alert && <div className="alert">{alert}</div>}
              <div className="btn">
                <button type="submit">Restablecer</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <AlertPopup message={error} showAlert={showAlert} onClose={closeAlert} />
      )}
    </>
  );
}
