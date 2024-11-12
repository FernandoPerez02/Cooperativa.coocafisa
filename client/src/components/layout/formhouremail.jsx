import React, { useState, useEffect } from 'react';
import flatpickr from 'flatpickr';
import "flatpickr/dist/flatpickr.min.css"; 
import "@public/styles/programhour.css";
import { programmatEmails } from '@/app/api/authenticated/adminService';

const HoraForm = () => {
  const [hora, setHora] = useState('');
  const [minuto, setMinuto] = useState('');
  const [periodo, setPeriodo] = useState('AM');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    flatpickr("#hora-input", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i K",
      time_24hr: false,  
      minuteIncrement: 5, 
      onChange: (selectedDates) => {
        const [hour, minute, period] = selectedDates[0].toLocaleTimeString('en-US').split(':');
        setHora(hour);
        setMinuto(minute);
        setPeriodo(period.trim());
      }
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await programmatEmails(hora, minuto)
  };

  const toggleFormVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div className="icon-container">
        <i className="bi bi-hourglass-top cursor-pointer" onClick={toggleFormVisibility}></i>
      </div>
      <div className={`form-container ${isVisible ? 'show' : ''} p-6 rounded-lg shadow-lg bg-white`}>
        <h2 className="text-2xl font-semibold mb-4">Programar Correos</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700">Hora</label>
            <input
              type="text"
              id="hora-input"
              className="mt-1 px-3 py-2 border border-gray-300 rounded-md w-full"
              placeholder="Selecciona la hora"
            />
          </div>
          <button type="submit" className="btn-submit mt-4 py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
};

export default HoraForm;
