"use client";
import React, { useState } from 'react';
import "@public/styles/table.css";

const Table = ({ data, title, nit, razonsoc, headers, expandedData, error }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>{title}</h1>
        <div className="header-details">
          <span><strong>NIT:</strong> {nit}</span>
          <span><strong>Razón Social:</strong> {razonsoc}</span>
        </div>
      </div>
      {error ? (
            <div className="error-message">{error}</div>
          ) : data.length === 0 ? (
            <div className="loading-message">No se encontraron registros disponibles...</div>
          ) : (
        <table className="responsive-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{item.cont1}</td>
                  <td>{item.cont2}</td>
                  <td>{item.cont3}</td>
                  <td>{item.cont4}</td>
                  <td>{item.cont5}</td>
                  <td>
                    <button onClick={() => toggleRow(index)}>
                      {expandedRows[index] ? 'Ocultar' : 'Ver más'}
                    </button>
                  </td>
                </tr>
                {expandedRows[index] && (
                  <tr className="expanded-row">
                    <td colSpan={headers.length + 1}> 
                      <div>
                        {expandedData[index]?.map((dataItem, idx) => (
                          <div key={idx}><strong>{dataItem.label}:</strong> {dataItem.value}</div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
          )}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button 
            key={index} 
            className={index + 1 === currentPage ? 'active' : ''}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Table;

