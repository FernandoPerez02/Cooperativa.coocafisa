import "@public/styles/login.css"
export const metadata = {
  title: "Login Page",
  description: "Sign in to your account",
};

export default function Userslayout({ children }) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="login bg-white shadow-lg p-8 rounded-lg contenedor">
        <header className="flex flex-col items-center">
          <img
            src="/images/Logo.cooperativa.png"
            alt="logo"
            className="w-24 h-24 mb-4 object-contain logo"
          />
          <h1 className="text-2xl font-bold text-foreground">
            titulos
          </h1>
        </header>
        <div className="w-full max-w-4xl p-8">{children}</div>
      </div>
    </section>
  );
}
