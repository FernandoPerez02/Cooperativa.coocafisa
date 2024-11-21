"use client";
import React from 'react';
import { Loader } from '@/components/common/preloader';

function Prueba() {
  const [loading, setLoading] = React.useState(true);
  const alert = "Este es un mensaje de alerta";
  const type = "alertMessage";

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
  }, []);
  return (
    <div className="App">
      {loading ? <Loader alert={alert} type={type}/> : <div>Cargando...</div>}
    </div>
  );
}

export default Prueba;
