"use client";
import ResultTable from "@/components/common/result_table";
import { useState, useEffect } from "react";
import { getEmailsPending } from "@/app/api/authenticated/adminService";
import HoraForm from "@/components/layout/formhouremail";
import { ProtectedRoute } from "../../../../components/middleware";

export default function PendingEmails() {
    const [pendingEmails, setPendingEmails] = useState([]);
    const [alert, setAlert] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            const pendingEmailsData = await getEmailsPending(setAlert);
            setPendingEmails(pendingEmailsData);
        }
        fetchData();
    }, []);

    const title = "Correos Pendientes";
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
        <HoraForm/>
        <ResultTable data={pendingEmails} title={title} headers={headers} fields={fields} error={alert} />
        </>
    );
}