import "@public/styles/login.css";

export default function Login() {
  return (
    <form action="/auth" method="post" className="space-y-4 mt-6">
      <div className="flex flex-col stlvar">
        <label htmlFor="nit" className="text-sm font-medium text-gray-700">
          Nit
        </label>
        <input
          type="number"
          id="nit"
          name="nit"
          required
          className="mt-1 p-2 border rounded-md focus:ring-foreground focus:border-foreground"
          placeholder="Ingresa tu NIT"
        />
      </div>

      <div className="flex flex-col stlvar">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="mt-1 p-2 border rounded-md focus:ring-foreground focus:border-foreground"
          placeholder="Ingresa tu contraseña"
        />
      </div>
      <div className="btn">
        <button type="submit" className="btn_ingresar w-full">
          Ingresar
        </button>

        <div className="text-center mt-4">
          <a
            href="resetpassword"
            className="text-sm text-foreground hover:underline"
          >
            ¿Restablecer Contraseña?
          </a>
        </div>
      </div>
    </form>
  );
}
