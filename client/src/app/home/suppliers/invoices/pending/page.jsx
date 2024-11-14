"use client"

import React, { useEffect, useState } from "react";
import Table from "@/components/common/table";
import { queryinvoicepending } from "@/app/api/authenticated/invoiceService";

export default function InvoicePending() {
    const [data, setInvoices] = useState([]);
    const [nit, setNit] = useState("N/A");
    const [razonsoc, setRazonsoc] = useState("N/A"); 

    useEffect(() => {
        const fetchInvoices = async () => {
            const invoices = await queryinvoicepending();
            const formattedData = invoices.map((invoice, index) => ({
                id: invoice.id || index + 1,
                nit: invoice.nit || "N/A",
                razonsoc: invoice.razonsoc || "N/A",
                cont1: invoice.factura || "Sin factura",
                cont2: invoice.fecfac,
                cont3: invoice.fecvcto,
                cont4: invoice.total || "0",
                cont5: invoice.retencion || "0",
                cont6: invoice.neto || "0",
                cont7: invoice.fecpago,
                cont8: invoice.pagfac || "0",
                cont9: invoice.total || "0"
            }));
            setInvoices(formattedData);
            if (formattedData.length > 0) {
                setNit(formattedData[0].nit);
                setRazonsoc(formattedData[0].razonsoc);
              } else {
                setNit("N/A");
                setRazonsoc("N/A");
              }
        };
        fetchInvoices();
    }, []);

    const expandedData = data.map((invoice) => [
        { label: "Fecha Pago", value: invoice.cont7 },
        { label: "Pago Factura", value: invoice.cont8 },
        { label: "Valor Pago", value: invoice.cont9 },
        { label: "Neto", value: invoice.cont6 }
    ]);

    const title = "Tus Facturas Pendientes";
    const headers = [
        "Factura", "Fecha Factura", "Fecha Vencimiento",
        "Total", "Retencion"
    ];


    return (
        <Table
            data={data}
            title={title}
            nit={nit}         
            razonsoc={razonsoc} 
            headers={headers}
            expandedData={expandedData}
        />
    );  
}