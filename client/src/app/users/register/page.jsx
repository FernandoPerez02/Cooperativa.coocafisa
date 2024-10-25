import '@public/styles/register.css'
export const metadata = {
  title: 'Register User',
  description: 'Registration of users interacting with the system'
}
export default function Registerusers() {
  return (
      <form action="/register" method="post">
        <div className="options">
          <div className="stlnit">
            <label htmlFor="nit">
              <h4>Nit</h4>
            </label>
            <input type="number" name="nit" id="nit" />
          </div>
          <div className="stlrazsoc">
            <label htmlFor="razsoc">
              <h4>Razon Social</h4>
            </label>
            <input type="text" name="razsoc" id="razsoc" />
          </div>
          <div className="stldirecc">
            <label htmlFor="direc">
              <h4>Dirección</h4>
            </label>
            <input type="text" name="direc" id="direc" />
          </div>
          <div className="stlcorreo">
            <label htmlFor="correo">
              <h4>Correo Eletronico</h4>
            </label>
            <input type="email" name="correo" id="correo" />
          </div>
          <div className="stltel">
            <label htmlFor="tel">
              <h4>Telefono</h4>
            </label>
            <input type="number" name="tel" id="tel" />
          </div>
          <div className="stlcel">
            <label htmlFor="cel">
              <h4>Celular</h4>
            </label>
            <input type="number" name="cel" id="cel" />
          </div>
          <div className="stlpass">
            <label htmlFor="pass">
              <h4>Contraseña</h4>
            </label>
            <input type="password" name="pass" id="pass" />
          </div>
          <div className="stlpasscon">
            <label htmlFor="passcon">
              <h4>Confirmar Contraseña</h4>
            </label>
            <input type="password" name="passcon" id="passcon" />
          </div>
        </div>
        <div className="btn_butones">
          <a href="login">
            <button type="button" className="btn_cancelar">
              <h4>Cancelar</h4>
            </button>
          </a>
          <button type="submit" className="btn_registrar">
            <h4>Registrar</h4>
          </button>
        </div>
      </form>
  );
}