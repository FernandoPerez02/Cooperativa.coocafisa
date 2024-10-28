"use client";
import React, { useState } from 'react';
import "@public/styles/table.css";

const Table = ({facturas}) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(facturas.length / itemsPerPage);
  const handlePageChane = (page) => {
    setCurrentPage(page);
  };
  const paginatedData = facturas.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
);

  return (
    <div className="container">
      <div className="cabezta">
        <h1>Tus Facturas</h1>
        <div className="cabezta-details">
          <span><strong>NIT:</strong> 103364698712345</span>
          <span><strong>Razón Social:</strong> Inversiones Gandaya</span>
        </div>
      </div>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Factura</th>
            <th>Fecha</th>
            <th>Vencimiento</th>
            <th>Total</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((factura, index) => (
            <React.Fragment key={index}>
              <tr key={index.id}>
                <td>{factura.factura}</td>
                <td>{factura.fecha}</td>
                <td>{factura.vencimiento}</td>
                <td>{factura.total}</td>
                <td>
                <button onClick={() => toggleRow(index)}>
                    {expandedRows[index] ? 'Ocultar' : 'Ver más'}
                  </button>
                </td>
              </tr>
              {expandedRows[index] && (
                <tr className="expanded-row">
                  <td colSpan="5">
                    <div><strong>Retención:</strong> {factura.retencion}</div>
                    <div><strong>Neto:</strong> {factura.neto}</div>
                    <div><strong>Fecha Pago:</strong> {factura.pago}</div>
                    <div><strong>Valor Pago:</strong> {factura.valorPago}</div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button key={index} className={index + 1 === currentPage ? 'active': ''}
          onClick={() => handlePageChane(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Table;
