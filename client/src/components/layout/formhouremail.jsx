import React, { useState, useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "@public/styles/programhour.css";
import { programmatEmails, timerEmails } from "@/app/api/authenticated/adminService";

const HoraForm = () => {
  const [hora, setHora] = useState("");
  const [minuto, setMinuto] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [alert, setAlert] = useState(null);
  const [timer, setTimer] = useState({ hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    flatpickr("#hora-input", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i K",
      time_24hr: true,
      minuteIncrement: 5,
      onChange: (selectedDates) => {
        const date = selectedDates[0];
        setHora(String(date.getHours()).padStart(2, "0"));
        setMinuto(String(date.getMinutes()).padStart(2, "0"));
      },
    });
  }, []);


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (hora && minuto) {
        calculateCountdown(hora, minuto); 
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hora, minuto]);

  const calculateCountdown = (hour, minute) => {
    const now = new Date();
    const targetTime = new Date();

    targetTime.setHours(hour || 0, minute || 0, 0, 0);

    if (now > targetTime) targetTime.setDate(targetTime.getDate() + 1);
    const countdown = targetTime - now;

    const hours = String(Math.floor((countdown / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const minutes = String(Math.floor((countdown / (1000 * 60)) % 60)).padStart(2, "0");
    const seconds = String(Math.floor((countdown / 1000) % 60)).padStart(2, "0");

    setTimer({ hours, minutes, seconds });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await programmatEmails(hora, minuto, setAlert);
    calculateCountdown(hora, minuto);
  };

  const toggleFormVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <div className="icon-container" onClick={toggleFormVisibility}>
        <i className="bi bi-hourglass-top cursor-pointer"></i>
      </div>
      <div className={`form-container ${isVisible ? "show" : ""}`}>
        <h2>Programar Correos</h2>
        <h3 className="next-send">Próximo envío en:</h3>
        <div className="timer-container">
          <div className="time-box">
            <span id="hours">{timer.hours}</span>
            <span className="label">Horas</span>
          </div>
          <div className="time-box">
            <span id="minutes">{timer.minutes}</span>
            <span className="label">Minutos</span>
          </div>
          <div className="time-box">
            <span id="seconds">{timer.seconds}</span>
            <span className="label">Segundos</span>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="hora-input">Hora:</label>
            <input
              type="text"
              id="hora-input"
              className="time-input"
              placeholder="Selecciona la hora"
            />
          </div>
          {alert && <div className="alert">{alert}</div>}
          <button type="submit" className="btn-submit">Guardar</button>
        </form>
      </div>
    </div>
  );
};

export default HoraForm;
