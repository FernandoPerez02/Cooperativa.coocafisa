"use client"
import { useState } from "react";
import { emailValidate } from "@/app/api/auth/passwordService";
import "@public/styles/formusers.css"
export default function Formvalidatemail() {
    const [alert, setAlert] = useState(null);
    console.log(alert)
    const handleSubmit =  async (event) => {
        event.preventDefault();
        await emailValidate(event, setAlert)
    }

    return (
        <div className="content">
            <header className="flex flex-col items-center">
          <img
            src="/images/Logo.cooperativa.png"
            alt="logo"
            className="w-24 h-24 mb-4 object-contain logo item"
          />
          <h1 className="text-2xl font-bold text-foreground item">Restablecer Contraseña</h1>
        </header>
        <form onSubmit={handleSubmit}> 
                    <div className="stlvar">
                        <label htmlFor="nit">Nit</label>
                        <input type="number" name="nit" id="nit"/>
                    </div>              
                    <div className="stlvar">
                        <label htmlFor="gmail">Gmail</label>
                        <input type="email" name="gmail" id="gmail"/>
                    </div>

                    <div className="btn_butones">
                    {alert && <div className="alert">{alert}</div>}
                    <div className="btn">
                        <a href="login"><button type="button" className="btn_regresar">Regresar</button></a>
                    </div>
                    <div className="btn">
                        <button type="submit" className="btn_enviar">Enviar Correo</button>
                    </div>
                    </div>                  
                </form>
        </div>
    );
}