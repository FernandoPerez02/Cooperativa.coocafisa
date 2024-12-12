/* "use client";
import { useEffect, useState } from "react";
import { logout } from "@/app/api/auth/authService";
import { getSession } from "@/app/api/authenticated/sessionService";
import AlertPopup from "./common/alert";
import { Loader } from "./common/preloader";
import "@public/styles/alertInativity.css";

export default function InactivityHandler() {
  const [inActive, setInActive] = useState(false);
  const [expiredSession, setExpiredSession] = useState(false);
  const [timer, setTimer] = useState({ minutes: "00", seconds: "00" });
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(false);

  const expirationTime = async () => {
    try {
      const sessionData = await getSession();
      const { minute, seconds } = sessionData.timeRemaining;
      if (sessionData?.timeRemaining) {
        setTimer({
          minutes: String(minute).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      } else {
        setTimer({ minutes: "00", seconds: "00" });
      }
    } catch (error) {
      setTimer({ minutes: "00", seconds: "00" });
    }
  };

  useEffect(() => {
    expirationTime();
  }, []);

  useEffect(() => {
    if (timer.minutes === "01" && timer.seconds === "00") {
      setInActive(true);
    }
  }, [timer]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer.minutes !== "00" || timer.seconds !== "00") {
        calculateCountdown(timer.minutes, timer.seconds);
      } else {
        clearInterval(intervalId);
        if (!expiredSession) {
          setExpiredSession(true);
          setInActive(false);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const calculateCountdown = (minute, second) => {
    let totalSeconds = parseInt(minute) * 60 + parseInt(second);
    totalSeconds--;

    const newMinutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const newSeconds = String(totalSeconds % 60).padStart(2, "0");
    if (newMinutes !== timer.minutes || newSeconds !== timer.seconds) {
      setTimer({ minutes: newMinutes, seconds: newSeconds });
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    setInActive(false);
    setExpiredSession(false);
    setLoading(true);
    await logout(event, setAlert, setType, setLoading);
  };

  return (
    <>
      {(inActive || expiredSession) && (
        <div className="blocking-layer">
            {inActive && (
              <AlertPopup
                message={`Llevas mucho tiempo inactivo. 
      ¿Deseas continuar navegando en la aplicación?`}
                type={"alertMessage"}
              >
                <div className="alert_text">
                  <p>La sesión expirará en:</p>
                </div>
                <div className="timer-container">
                  <div className="time-box">
                    <span id="minutes">{timer.minutes}</span>
                    <span className="label">Minutos</span>
                  </div>
                  <div className="time-box">
                    <span id="seconds">{timer.seconds}</span>
                    <span className="label">Segundos</span>
                  </div>
                </div>
                <div className="btn_alert">
                  <button onClick={handleLogout}>No</button>
                  <button onClick={() => ( setInActive(false),
                    window.location.reload())}>si</button>
                </div>
              </AlertPopup>
            )}

            {expiredSession && (
              <AlertPopup
                message={`Has tardado mucho. Vuelve a iniciar sesión para continuar navegando.`}
              >
                <button onClick={handleLogout}>Aceptar</button>
              </AlertPopup>
            )}
        </div>
      )}
      {loading && <Loader alert={alert} type={type} />}
    </>
  );
} */

"use client";
import { useEffect, useState, useCallback } from "react";
import { logout } from "@/app/api/auth/authService";
import { getSession } from "@/app/api/authenticated/sessionService";
import AlertPopup from "./common/alert";
import { Loader } from "./common/preloader";
import "@public/styles/alertInativity.css";

export default function InactivityHandler() {
  const [sessionState, setSessionState] = useState("active");
  const [timer, setTimer] = useState({ minutes: "00", seconds: "00" });
  const [alert, setAlert] = useState(null);
  const [type, setType] = useState(false);
  const [loading, setLoading] = useState(false);

  const expirationTime = useCallback(async () => {
    try {
      const sessionData = await getSession();
      if (sessionData?.timeRemaining) {
        const { minute, seconds } = sessionData.timeRemaining;
        console.log(minute, seconds);
        setTimer({
          minutes: String(minute).padStart(2, "0"),
          seconds: String(seconds).padStart(2, "0"),
        });
      } else {
        setTimer({ minutes: "00", seconds: "00" });
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
      setTimer({ minutes: "00", seconds: "00" });
    }
  }, []);

  useEffect(() => {
    expirationTime();
    console.log("expirationTime", timer);
  }, [expirationTime]);

  useEffect(() => {
    if (timer.minutes === "01" && timer.seconds === "00") {
      setSessionState("inactive");
    }
  }, [timer]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer.minutes !== "00" || timer.seconds !== "00") {
        calculateCountdown(timer.minutes, timer.seconds);
      } else {
        clearInterval(intervalId);
        if (sessionState !== "expired") {
          setSessionState("expired");
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, sessionState]);

  const calculateCountdown = (minute, second) => {
    let totalSeconds = parseInt(minute) * 60 + parseInt(second);
    totalSeconds--;

    setTimer({
      minutes: String(Math.floor(totalSeconds / 60)).padStart(2, "0"),
      seconds: String(totalSeconds % 60).padStart(2, "0"),
    });
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    setSessionState("active");
    setLoading(true);
    await logout(event, setAlert, setType, setLoading);
  };

  const renderAlert = () => {
    if (sessionState === "inactive") {
      return (
        <AlertPopup
          message="Llevas mucho tiempo inactivo. ¿Deseas continuar navegando en la aplicación?"
          type="alertMessage"
        >
          <div className="alert_text">
            <p>La sesión expirará en:</p>
          </div>
          <div className="timer-container">
            <div className="time-box">
              <span id="minutes">{timer.minutes}</span>
              <span className="label">Minutos</span>
            </div>
            <div className="time-box">
              <span id="seconds">{timer.seconds}</span>
              <span className="label">Segundos</span>
            </div>
          </div>
          <div className="btn_alert">
            <button onClick={handleLogout}>No</button>
            <button onClick={() => setSessionState("active")}>Sí</button>
          </div>
        </AlertPopup>
      );
    }

    if (sessionState === "expired") {
      return (
        <AlertPopup
          message="Has tardado mucho. Vuelve a iniciar sesión para continuar navegando."
        >
          <button onClick={handleLogout}>Aceptar</button>
        </AlertPopup>
      );
    }

    return null;
  };

  return (
    <>
      {(sessionState === "inactive" || sessionState === "expired") && (
        <div className="blocking-layer">{renderAlert()}</div>
      )}
      {loading && <Loader alert={alert} type={type} />}
    </>
  );
}

