import React, { useEffect } from 'react';
import '@public/styles/preloader.css';
import AlertPopup from './alert';

export const Loader = ({alert, type}) => {
  return (
    <div className="loader-container">
      <AlertPopup message={alert} type={type} />
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
    </div>
  );
};
