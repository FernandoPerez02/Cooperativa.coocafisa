"use client";
import React, { useState } from 'react';
import "@public/styles/table.css";

const ResultTable = ({ data, title,headers, fields}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container">
      <div className="header">
        <h1>{title}</h1>
      </div>
      {data.length === 0 ? (
        <div className="loading-message">Buscando registros...</div>
      ) : (
        <table className="responsive-table">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, rowIndex) => (
              <tr key={rowIndex}>
              {fields.map((field, colIndex) => (
                <td key={colIndex}>{field === "num" ? rowIndex + 1 : item[field] || 'N/A'}</td>
                ))}
            </tr>
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

export default ResultTable;
