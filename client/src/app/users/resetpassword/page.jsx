"use client"
import { useState } from "react";
import { emailValidate } from "@/app/api/auth/passwordService";
import "@public/styles/formusers.css"
import AlertPopup from "@/components/common/alert";
export default function Formvalidatemail() {
    const [alert, setAlert] = useState(null);
    const [showAlert, setShowAlert] = useState(false);

    const handleSubmit =  async (event) => {
        event.preventDefault();
        await emailValidate(event, setAlert)
        handleAlert();
    }


    const handleAlert = () => {
        setShowAlert(true);
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    return (
        <div className="content">
            <AlertPopup message={alert} showAlert={showAlert} onClose={closeAlert} />
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
                    <div className="btn_butones">
                    <div className="btn">
                        <a href="/"><button type="button" className="btn_regresar">Regresar</button></a>
                    </div>
                    <div className="btn">
                        <button type="submit" className="btn_enviar">Enviar Correo</button>
                    </div>
                    </div>                  
                </form>
        </div>
    );
}