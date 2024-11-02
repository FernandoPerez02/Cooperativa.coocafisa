import "@public/styles/formusers.css";
export default function Formresetpass() {
  return (
    <div className="content">
      <header className="flex flex-col items-center">
          <img
            src="/images/Logo.cooperativa.png"
            alt="logo"
            className="w-24 h-24 mb-4 object-contain logo item"
          />
          <h1 className="text-2xl font-bold text-foreground item">Restablecer Contraseña</h1>
        </header>
        <div className="form-container">
      <form action="/resetpass" method="post">
        <div className="stlvar">
          <label htmlFor="nit">NIT</label>
          <input type="number" name="nit" id="nit" required />
        </div>
        <div className="stlvar">
          <label htmlFor="newpass">Nueva Contraseña</label>
          <input type="password" name="newpass" id="newpass" required />
        </div>
        <div className="stlvar">
          <label htmlFor="confpass">Confirmar Contraseña</label>
          <input type="password" name="confpass" id="confpass" required />
        </div>
        <div className="btn">
          <button type="submit">Restablecer</button>
        </div>
      </form>
    </div>
    </div>
  );
}
