"use client";
import { useState, useEffect } from "react";
import ResultTable from "@/components/common/result_table";
import { queryEmails } from "@/app/api/authenticated/adminService";
import HoraForm from "@/components/layout/formhouremail";
export default function Emails() {
    const [email, setEmail] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const email = await queryEmails();
                if (email.length === 0) {
                    setError("No hay correos programados.");
                } else {
                    setEmail(email);
                }
            } catch (error) {
                setError("Error al obtener los correos.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const title = "Correos Programados";
    const headers = [
        "NIT",
        "Factura",
        "Fecha Pago",
        "Razón Social",
        "Correo Electrónico"
    ];

    const fields = [
        "nit",
        "factura",
        "fecpago",
        "razonsoc",
        "correo"
    ];
    return (
        <>
        <ResultTable data={email} title={title} headers={headers} fields={fields}/>
        <HoraForm />
        </>
    )
}