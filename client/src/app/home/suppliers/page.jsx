import "@public/styles/table.css"
export default function Suppliers() {
    return (
        <table>
            <thead>
                <tr>
                    <th>NIT</th>
                    <th>Razon Social</th>
                    <th>Pago</th>
                    <th>Descuento</th>
                    <th>Retención</th>
                    <th>Fecha Pago</th>
                </tr>
            </thead>    
            <tbody>
                <td>1033646</td>
                <td>Admin</td>
                <td>975.000</td>
                <td>20.000</td>
                <td>10.000</td>
                <td>25-10-2024</td>
            </tbody>
        </table>
    );
}