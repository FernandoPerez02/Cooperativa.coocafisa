"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/common/table";
import { queryInvoices } from "@/app/api/authenticated/invoiceService";

export default function Suppliers() {
  const [data, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nit, setNit] = useState("N/A");
  const [razonsoc, setRazonsoc] = useState("N/A"); 

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      setError(null);
      try {
        const invoices = await queryInvoices(setError);
        if (invoices.length === 0) {
          setError("No se encontraron datos.");
        } else {
          const formattedData = invoices.map((invoice, index) => ({
            id: invoice.id || index + 1,
            nit: invoice.nit || "N/A",
            razonsoc: invoice.razonsoc || "N/A",
            cont1: invoice.factura || "Sin factura",
            cont2: invoice.fecfac || "Sin fecha",
            cont3: invoice.fecvcto || "Sin vencimiento",
            cont4: invoice.total || "0",
            cont5: invoice.retencion || "0",
            cont6: invoice.neto || "0",
            cont7: invoice.fecpago || "Sin fecha de pago",
            cont8: invoice.pagfac || "0",
            cont9: invoice.total || "0"
          }));

          setInvoices(formattedData);

          setNit(formattedData[0].nit);
          setRazonsoc(formattedData[0].razonsoc);
        }
      } catch (error) {
        setError("Error al obtener datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (loading) return <p>No se encontraron registros disponibles...</p>;

  const expandedData = data.map((invoice) => [
    { label: "Fecha Pago", value: invoice.cont7 },
    { label: "Pago Factura", value: invoice.cont8 },
    { label: "Valor Pago", value: invoice.cont9 },
    { label: "Neto", value: invoice.cont6 }
  ]);

  const title = "Tus Facturas";
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
