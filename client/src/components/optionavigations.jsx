"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./Header";

export default function Navigations() {
  const pathname = usePathname();
  const [opciones, setOpciones] = useState([]);

  useEffect(() => {
    const assignMenu = assignOptions(pathname);
    setOpciones(assignMenu);
  }, [pathname]);

  const assignOptions = (ruta) => {
    const indices = routeToIndices[ruta] || indiceDefault();
    return indices.map(index => menuOptions[index])
  };

  const indiceDefault = () => {
    return [0,3]
  }

  return <Header menuOptions={opciones} />;
}

const routeToIndices = {
    "/home": [0, 1, 2, 3, 7],
    "/home/suppliers": [4, 5, 6]
}

const menuOptions = [
  { id: 1, label: "Inicio", link: "/home" },
  { id: 2, label: "Usuarios", link: "/users/registeredusers" },
  { id: 3, label: "Registrar Usuario", link: "/users/register" },
  { id: 4, label: "Programar Correos", link: "/emails" },
  { id: 5, label: "Facturas", link: "/home/suppliers/invoices"},
  { id: 6, label: "Facturas Pagas", link: "/home/suppliers/invoices/payments"},
  { id: 7, label: "Facturas Pendientes", link: "/home/suppliers/invoices/pending"},
  { id: 8, label: "Provedor", link: "/home/suppliers/"}
];


