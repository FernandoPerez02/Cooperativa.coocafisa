import Menu from "@/components/navigationmenu";
export const metadata = {
  title: "Home",
  description: "Home page for all users",
};

export default function Indexlayout({ children }) {
  const menuOptions = [
    { id: 1, label: "Inicio", link: "/home" },
    { id: 2, label: "Configuración", link: "/home" },
    // Otras opciones específicas para el perfil
  ];
  return (
    <div className="container">
      <header>
        <img
          src="/images/Logo.cooperativa.png"
          alt="logo"
          className="imglogoindex"
        />
        <h1>Bienvenido a CoopFinanzas</h1>
        <Menu options={menuOptions} />
      </header>
      <main>
        <div className="w-full max-w-4xl p-8">{children}</div>
      </main>
    </div>
  );
}
