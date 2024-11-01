import React from 'react';
import Table from '@/components/common/table';

const App = () => {
  const data = [
    { id: 1, cont1: 'Dato 1', cont2: 'Dato 2', cont3: 'Dato 3', cont4: 'Dato 4', cont5: 'Dato 5', cont6: 'Más Dato 6', cont7: 'Más Dato 7', cont8: 'Más Dato 8', cont9: 'Más Dato 9' },
    { id: 2, cont1: 'Dato 1', cont2: 'Dato 2', cont3: 'Dato 3', cont4: 'Dato 4', cont5: 'Dato 5', cont6: 'Más Dato 6', cont7: 'Más Dato 7', cont8: 'Más Dato 8', cont9: 'Más Dato 9' },
  ];

  const title = "Título de la Tabla";
  const nit = "123456789";
  const razonsoc = "Razón Social Ejemplo";
  const headers = ["Encabezado 1", "Encabezado 2", "Encabezado 3", "Encabezado 4", "Encabezado 5"];

  return (
    <div>
      <Table data={data} title={title} nit={nit} razonsoc={razonsoc} headers={headers} expandedData={expandedData}/>
    </div>
  );
};

export default App;


