"use client";
import React, { useState, useEffect } from "react";
import "@public/styles/testTbale.css";
import Search from "./search";

const ResultTable = ({ data, keysToSearch, title, headers, fields, error }) => {
  const [filteredData, setFilteredData] = useState(data);
  const [originalData, setOriginalData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setOriginalData(data);
    setFilteredData(data);
  }, [data]);

  const handleFilter = (filtered) => {
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="title-search">
          <h1>{title}</h1>
          <Search
            data={originalData}
            keysToSearch={keysToSearch}
            onFilteredData={handleFilter}
          />
        </div>
      </div>
      {error ? (
        <div className="error-message">{error}</div>
      ) : filteredData.length === 0 ? (
        <div className="loading-message">No se encontraron registros...</div>
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
                  <td key={colIndex} data-label={headers[colIndex]}>
                    {field === "num" ? rowIndex + 1 : item[field] || "N/A"}
                  </td>
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
            className={index + 1 === currentPage ? "active" : ""}
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
