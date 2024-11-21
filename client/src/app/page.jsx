"use client";
import { useState } from "react";
import "@public/styles/formusers.css";
import { auth } from "@/app/api/auth/authService";
import {Loader} from "@/components/common/preloader";

export default function Login() {
    const [type, setType] = useState(false);
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        await auth(event, setAlert, setLoading, setType);
    }
    return (
        <div className="content">
            <header>
                <img
                    src="/images/Logo.cooperativa.png"
                    alt="logo"
                    className="w-1 h-1 mb-4 object-contain logo"
                />
                <h1 className="text-2xl font-bold">Inicio de Sesión</h1>
            </header>
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="flex flex-col stlvar">
                    <label htmlFor="nit" className="text-sm font-medium text-gray-700">
                        Nit
                    </label>
                    <input
                    
                        type="number"
                        id="nit"
                        name="nit"
                        required
                        className="mt-1 p-2 border rounded-md focus:ring-foreground focus:border-foreground"
                    />
                </div>

                <div className="flex flex-col stlvar">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="mt-1 p-2 border rounded-md focus:ring-foreground focus:border-foreground"
                    />
                </div>
                <div className="btn">
                    <button type="submit" className="btn_ingresar w-full">
                        Ingresar
                    </button>

                    <div className="text-center mt-4">
                        <a
                            href="/users/resetpassword"
                            className="text-sm text-foreground hover:underline"
                        >
                            ¿Restablecer Contraseña?
                        </a>
                    </div>
                </div>
               </form>
               {loading && <Loader alert={alert} type={type}/>}
        </div>
    );
}
