"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "@public/styles/formusers.css";
import { auth } from "@/app/api/auth/authService";

export default function Login() {
    const router = useRouter();
    const [alert, setAlert] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await auth(event, router, setAlert)
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
                {alert && <div className="alert">{alert}</div>}
                    <button type="submit" className="btn_ingresar w-full">
                        Ingresar
                    </button>

                    <div className="text-center mt-4">
                        <a
                            href="resetpassword"
                            className="text-sm text-foreground hover:underline"
                        >
                            ¿Restablecer Contraseña?
                        </a>
                    </div>
                </div>
               </form>
        </div>
    );
}
