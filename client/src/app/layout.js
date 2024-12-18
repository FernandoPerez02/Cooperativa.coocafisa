import "@public/styles/globals.css";
import { AuthProvider } from "../api/auth/authContext";
export const metadata = {
  icon: "/favicon.ico",
  title: "Cooperativa de Caficultores de Salgar-CoopFinanzas",
  description: "Generated by Next.js",
};

export default function RootLayout({ children }) {

  return (
    <html lang="es" className="h-full bg-white">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="h-full">
        <AuthProvider>
          {children}
        </AuthProvider>
        <footer>
          <h5>
            <img src="/images/Drau.png" alt="imgautor" className="imgautors" />
            Todos los derechos reservados de coocafisa
          </h5>
        </footer>
      </body>
    </html>
  );
}
