import "@public/styles/formusers.css";
export default function Formvalidatemail() {
    const title = "Restablecer Contraseña"
    return (
        <div className="content">
            <header className="flex flex-col items-center">
          <img
            src="/images/Logo.cooperativa.png"
            alt="logo"
            className="w-24 h-24 mb-4 object-contain logo item"
          />
          <h1 className="text-2xl font-bold text-foreground item">{title}</h1>
        </header>
        <form action="/emailresetpass" method="post"> 
                    <div className="stlvar">
                        <label htmlFor="nit">Nit</label>
                        <input type="number" name="nit" id="nit"/>
                    </div>              
                    <div className="stlvar">
                        <label htmlFor="gmail">Gmail</label>
                        <input type="email" name="gmail" id="gmail"/>
                    </div>

                    <div className="btn_butones">
                    <div className="btn">
                        <a href="login"><button type="button" className="btn_regresar">Regresar</button></a>
                    </div>
                    <div className="btn">
                        <button type="submit" className="btn_enviar">Enviar Correo</button>
                    </div>
                    </div>                  
                </form>
        </div>
    );
}