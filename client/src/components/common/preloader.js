import React, { useEffect } from 'react';
import '@public/styles/preloader.css';

export const Loader = ({alert, type}) => {
  return (
    <div className="loader-container">
      <div className={`alert-loader ${type}`}>  
        {alert}
      </div> 
      <div className="circle-container">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      </div>
    </div>
  );
};
