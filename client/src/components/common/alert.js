import React, { useEffect } from 'react';
import "@public/styles/alert.css";

const AlertPopup = ({ message, showAlert, onClose }) => {
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showAlert, onClose]);

  if (!showAlert) return null;

  return (
    <div className="alert-popup">
      <div className="alert-content">
        <span className="alert-message">{message}</span>
      </div>
    </div>
  );
};

export default AlertPopup;
