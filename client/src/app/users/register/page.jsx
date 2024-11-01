"use client"
import { adduser } from "@/app/api/auth/registerService";
import "@public/styles/formusers.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* export const metadata = {
  title: "Register User",
  description: "Registration of users interacting with the system",
}; */

export default function Registerusers() {
  const router = useRouter();
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (event) => {
      event.preventDefault();
      await adduser(event, router, setAlert)
    };

  return (
    <div className="content">
      <header>
        <img
          src="/images/Logo.cooperativa.png"
          alt="logo"
          className="w-24 h-24 mb-4 object-contain logo"
        />
        <h1 className="text-2xl font-bold">Registro de Usuarios</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="options">
          <div className="stlvar">
            <label htmlFor="nit">Nit</label>
            <input type="number" name="nit" id="nit" required />
          </div>

          <div className="stlvar">
            <label htmlFor="razsoc">Razón Social</label>
            <input type="text" name="razsoc" id="razsoc" required />
          </div>

          <div className="stlvar">
            <label htmlFor="direc">Dirección</label>
            <input type="text" name="direc" id="direc" required />
          </div>

          <div className="stlvar">
            <label htmlFor="correo">Correo Electrónico</label>
            <input type="email" name="correo" id="correo" required />
          </div>

          <div className="stlvar">
            <label htmlFor="tel">Teléfono</label>
            <input type="number" name="tel" id="tel" required />
          </div>

          <div className="stlvar">
            <label htmlFor="cel">Celular</label>
            <input type="number" name="cel" id="cel" required />
          </div>

          <div className="stlvar">
            <label htmlFor="pass">Contraseña</label>
            <input type="password" name="pass" id="pass" required />
          </div>

          <div className="stlvar">
            <label htmlFor="passcon">Confirmar Contraseña</label>
            <input type="password" name="passcon" id="passcon" required />
          </div>
        </div>

        <div className="btn_butones">
          <a href="login">
            <button type="button" className="btn_cancelar">
              Regresar
            </button>
          </a>

          <button type="submit" className="btn_registrar">
            Registrar
          </button>
        </div>
        {alert && <div className="alert">{alert}</div>}
      </form>
    </div>
  );
}
