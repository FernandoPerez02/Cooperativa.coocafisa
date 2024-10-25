

export default function Formresetpass() {
    return (
        <form action="/resetpass" method="post">
                    <div className="stlvar">
                        <label htmlFor="nit">Nit</label>
                        <input type="number" name="nit" id="nit"/>
                    </div>
                    <div className="stlvar">
                        <label htmlFor="newpass">Nueva Contraseña</label>
                        <input type="password" name="newpass" id="newpass"/>
                    </div>              
                    <div className="stlvar">
                        <label htmlFor="confpass">Confirmar Contraseña</label>
                        <input type="password" name="confpass" id="confpass"/>
                    </div> 
                    <div className="btn">
                        <button type="submit">Restablecer</button>
                    </div>                   
                </form>
    );
}