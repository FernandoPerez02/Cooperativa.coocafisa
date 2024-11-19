"use client";
import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "../../components/middleware";
import AlertPopup from "@/components/common/alert";
export default function Homepage() {
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        handleAlert();
    }, []);

    const handleAlert = () => {
        setShowAlert(true);
      };
    
      const closeAlert = () => {
        setShowAlert(false);
      };
    return (
        <>
        
        <div>
      <AlertPopup 
        message="Este es un mensaje de alerta." 
        showAlert={showAlert} 
        onClose={closeAlert} 
      />
    </div>
        </>
    );
}
