export default function Formvalidatemail() {
    return (
        <form action="/emailresetpass" method="post"> 
                    <div className="stlvar">
                        <label htmlFor="nit">Nit</label>
                        <input type="number" name="nit" id="nit"/>
                    </div>              
                    <div className="stlvar">
                        <label htmlFor="gmail">Gmail</label>
                        <input type="email" name="gmail" id="gmail"/>
                    </div> 
                    <div className="btn">
                        <button type="submit" className="btn_enviar">Enviar Correo</button>
                    </div>
                    <div className="btn">
                        <a href="login"><button type="button" className="btn_regresar">Regresar</button></a>
                    </div>                  
                </form>
    );
}