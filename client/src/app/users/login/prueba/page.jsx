"use client"
import React, { useEffect, useState } from 'react';
import { queryInvoices } from '../../../api/authenticated/invoiceService';

const InvoicesTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            setError(null); 
            const data = await queryInvoices();
            if (data.length === 0) {
                setError("No se encontraron facturas.");
            } else {
                setInvoices(data);
            }
            setLoading(false);
        };

        fetchInvoices();
    }, []); 

    if (loading) return <p>Cargando facturas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>Lista de Facturas</h1>
            <table>
                <thead>
                    <tr>
                        <th>NIT</th>
                        <th>Razón Social</th>
                        <th>Descuento</th>
                        <th>Retención</th>
                        <th>Total</th>
                        <th>Fecha de Pago</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice, index) => (
                        <tr key={index}>
                            <td>{invoice.nit}</td>
                            <td>{invoice.razonsoc}</td>
                            <td>{invoice.descuento}</td>
                            <td>{invoice.retencion}</td>
                            <td>{invoice.total}</td>
                            <td>{new Date(invoice.fecpago).toLocaleDateString('es-ES')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoicesTable;
