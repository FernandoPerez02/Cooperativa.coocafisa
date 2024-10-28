import Table from "@/components/table";  
export default function Suppliers() {
    return (
        <Table facturas={facturas}/>
    );
}

const facturas = [
    { factura: '001', fecha: '2024-10-01', vencimiento: '2024-11-01', total: '$1000', retencion:'23.000' },
    { factura: '002', fecha: '2024-09-15', vencimiento: '2024-10-15', total: '$500' },
    { factura: '003', fecha: '2024-08-25', vencimiento: '2024-09-25', total: '$1200' },
    { factura: '004', fecha: '2024-07-10', vencimiento: '2024-08-10', total: '$850' },
    { factura: '005', fecha: '2024-10-02', vencimiento: '2024-11-02', total: '$750' },
    { factura: '006', fecha: '2024-09-22', vencimiento: '2024-10-22', total: '$300' },
    { factura: '007', fecha: '2024-08-05', vencimiento: '2024-09-05', total: '$900' },
    { factura: '008', fecha: '2024-07-15', vencimiento: '2024-08-15', total: '$400' },
    { factura: '009', fecha: '2024-06-25', vencimiento: '2024-07-25', total: '$650' },
    { factura: '010', fecha: '2024-05-10', vencimiento: '2024-06-10', total: '$2000' },
    { factura: '011', fecha: '2024-04-01', vencimiento: '2024-05-01', total: '$1100' },
    { factura: '012', fecha: '2024-03-20', vencimiento: '2024-04-20', total: '$600' },
    { factura: '013', fecha: '2024-02-15', vencimiento: '2024-03-15', total: '$1800' },
    { factura: '014', fecha: '2024-01-10', vencimiento: '2024-02-10', total: '$950' },
    { factura: '015', fecha: '2023-12-01', vencimiento: '2024-01-01', total: '$1300' },
    { factura: '016', fecha: '2023-11-05', vencimiento: '2023-12-05', total: '$750' },
    { factura: '017', fecha: '2023-10-15', vencimiento: '2023-11-15', total: '$400' },
    { factura: '018', fecha: '2023-09-20', vencimiento: '2023-10-20', total: '$300' },
    { factura: '019', fecha: '2023-08-01', vencimiento: '2023-09-01', total: '$1400' },
    { factura: '020', fecha: '2023-07-25', vencimiento: '2023-08-25', total: '$600' },
    { factura: '021', fecha: '2023-06-10', vencimiento: '2023-07-10', total: '$1700' },
    { factura: '022', fecha: '2023-05-15', vencimiento: '2023-06-15', total: '$2200' },
    { factura: '023', fecha: '2023-04-05', vencimiento: '2023-05-05', total: '$800' },
    { factura: '024', fecha: '2023-03-10', vencimiento: '2023-04-10', total: '$950' },
    { factura: '025', fecha: '2023-02-20', vencimiento: '2023-03-20', total: '$400' },
    { factura: '026', fecha: '2023-01-15', vencimiento: '2023-02-15', total: '$1000' },
    { factura: '027', fecha: '2022-12-01', vencimiento: '2023-01-01', total: '$2100' },
    { factura: '028', fecha: '2022-11-10', vencimiento: '2022-12-10', total: '$1500' },
    { factura: '029', fecha: '2022-10-25', vencimiento: '2022-11-25', total: '$1200' },
    { factura: '030', fecha: '2022-09-15', vencimiento: '2022-10-15', total: '$900' }
  ];
  