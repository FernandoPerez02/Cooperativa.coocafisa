"use client"
import { adduser } from "@/app/api/auth/registerService";
import "@public/styles/formusers.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProtectedRoute } from "@/components/middleware";

export default function Registerusers() {
  const router = useRouter();
  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    nit: "",
    razsoc: "",
    direc: "",
    correo: "",
    tel: "",
    cel: "",
    pass: "",
    passcon: ""
  });

  const isValid = 
  Object.entries(formValues).every(([key, value]) => {
    if (key === "direc" || key === "tel" || key === "cel") {
      return true; // Estos campos son opcionales, no es necesario que tengan valor
    }
    return value !== "" && !errors[key]; // Validación solo para campos obligatorios y sin errores
  });

  // Validación que solo establece el borde rojo si hay un error
  const validateField = (name, value) => {
    let error = "";
    if (value.trim() === "" && ["nit", "razsoc", "correo", "pass", "passcon"].includes(name)) {
      error = "Este campo es obligatorio";
    } else if (name === "correo" && value && !/\S+@\S+\.\S+/.test(value)) {
      error = "El correo no es válido";
    } else if ((name === "tel" || name === "cel") && value && !/^\d+$/.test(value)) {
      error = "Debe ser un número válido";
    }
    return error;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });

    // Validar solo si el campo no está vacío o es obligatorio
    if (value || ["nit", "razsoc", "correo", "pass", "passcon"].includes(name)) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    } else {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleFocus = () => {
    const newErrors = {};
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key];
      newErrors[key] = validateField(key, value);
    });
    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await adduser(event, router, setAlert, setErrors);
  };

  return (
    <>
    <ProtectedRoute/>
          <div className="content_register">
      <header>
        <img
          src="/images/Logo.cooperativa.png"
          alt="logo"
          className="w-24 h-24 mb-4 object-contain logoReg"
        />
        <h1 className="text-2xl font-bold">Registro de Usuarios</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="options">
          <div className="stlvar">
            <label htmlFor="nit">Nit</label>
            <input 
              type="number" 
              name="nit" 
              id="nit" 
              value={formValues.nit}
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.nit ? 'error' : ''}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="razsoc">Razón Social</label>
            <input 
              type="text" 
              name="razsoc" 
              id="razsoc"
              value={formValues.razsoc} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.razsoc ? 'error' : ''}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="direc">Dirección</label>
            <input 
              type="text" 
              name="direc" 
              id="direc"
              value={formValues.direc} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.direc ? 'error' : ''}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="correo">Correo Electrónico</label>
            <input 
              type="email" 
              name="correo" 
              id="correo"
              value={formValues.correo} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.correo ? 'error' : ''}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="tel">Teléfono</label>
            <input 
              type="number" 
              name="tel" 
              id="tel"
              value={formValues.tel} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.tel ? 'error' : ''}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="cel">Celular</label>
            <input 
              type="number" 
              name="cel" 
              id="cel"
              value={formValues.cel} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.cel ? 'error' : ''}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="pass">Contraseña</label>
            <input 
              type="password" 
              name="pass" 
              id="pass"
              value={formValues.pass} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.pass ? 'error' : ''}
            />
          </div>

          <div className="stlvar">
            <label htmlFor="passcon">Confirmar Contraseña</label>
            <input 
              type="password" 
              name="passcon" 
              id="passcon"
              value={formValues.passcon} 
              onChange={handleChange}
              onFocus={handleFocus}
              className={errors.passcon ? 'error' : ''}
            />
          </div>
        </div>

        {alert && <div className="alert">{alert}</div>}
        
        {Object.keys(errors).some((key) => errors[key]) && (
  <div className="general-error-message">
    <p>Estos campos son obligatorios.</p>
  </div>
)}


        <div className="btn_butones">
          <a href="/home">
            <button type="button" className="btn_cancelar">
              Regresar
            </button>
          </a>

          <button type="submit" className="btn_registrar" disabled={!isValid}>
            Registrar
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
