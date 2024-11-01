import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const AlertComponent = ({ alertTitle, alertMessage, alertIcon, timer, ruta }) => {
    useEffect(() => {
        if (alertTitle && alertMessage && alertIcon) {
            Swal.fire({
                title: alertTitle,
                text: alertMessage,
                icon: alertIcon,
                timer: timer,
                timerProgressBar: true,
            }).then(() => {
                window.location = ruta;
            });
        }
    }, [alertTitle, alertMessage, alertIcon, timer, ruta]);

    return null; // No renderiza nada en el DOM
};

export default AlertComponent;
