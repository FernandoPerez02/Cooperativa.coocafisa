"use client";
import IndexLayout from "../home/layout";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryUsers } from "@/app/api/authenticated/queryService";
import { ProtectedRoute } from "../../components/middleware";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const users = await queryUsers();
                if (users.length === 0) {
                    setError("No hay usuarios registrados.");
                } else {
                    setUsers(users); 
                }
            } catch (error) {
                setError("Error al obtener los usuarios.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const title = "Usuarios";
    const headers = [
        "#",
        "NIT",
        "Razón Social",
        "Dirección",
        "Correo Electrónico",
        "Celular",
        "Teléfono",
        "Fecha de Registro",
    ];

    // Los campos deben coincidir con las claves de los objetos de los usuarios
    const fields = [
        "num",      // Para el índice
        "nit",
        "razonsoc",
        "direcc",
        "correo",
        "celular",
        "telefono",
        "fecha_reg"
    ];

    return (
        <IndexLayout>
            <ProtectedRoute/>
            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <ResultTable
                    title={title}
                    headers={headers}
                    data={users}
                    fields={fields}
                />
            )}
        </IndexLayout>
    );
}
