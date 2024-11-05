// functions/pdfService.js
const PDFDocument = require('pdfkit');
const path = require('path');

const generarReportePDF = (data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];

        // Captura los datos del PDF en un buffer
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers)); // Devuelve el buffer completo
        });

        const logoPath = "public/images/Logo.cooperativa.png"


        // Logo
        doc.image(logoPath, 50, 40, { width: 100, height: 100 });

        // Título
        doc.fontSize(20).fillColor('#007BFF').text('Informe Diario de Pagos', { align: 'center', underline: true });
        doc.moveDown(1.5);

        // Tabla - Encabezado
        const tableTop = 150;
        const itemSpacing = 25;
        const headers = ["NIT", "Empresa", "Descuento", "Retención", "Pago", "Fecha de Pago"];

        // Encabezado
        doc.fillColor('#FFFFFF').fontSize(12).rect(50, tableTop - 10, 500, 20).fill('#007BFF');
        headers.forEach((header, i) => {
            doc.fillColor('#FFFFFF').text(header, 55 + i * 80, tableTop, { width: 80, align: 'center' });
        });

        // Agregar Filas de Datos
        let rowTop = tableTop + 20;
        doc.fontSize(10).fillColor('#333333');
        data.forEach((item, index) => {
            const bgColor = index % 2 === 0 ? '#F2F2F2' : '#FFFFFF';
            doc.fillColor(bgColor).rect(50, rowTop - 10, 500, 20).fill();
            doc.fillColor('#333333');

            // Columnas
            doc.text(item.nit, 55, rowTop, { width: 80, align: 'center' });
            doc.text(item.razonsoc, 135, rowTop, { width: 80, align: 'center' });
            doc.text(item.descuento, 215, rowTop, { width: 80, align: 'center' });
            doc.text(item.retencion, 295, rowTop, { width: 80, align: 'center' });
            doc.text(item.total, 375, rowTop, { width: 80, align: 'center' });
            doc.text(item.fecpago, 455, rowTop, { width: 80, align: 'center' });
            rowTop += itemSpacing;
        });

        // Pie de Página
        doc.fillColor('#777777').fontSize(10).text('Este informe es generado automáticamente y es confidencial.', 0, rowTop + 40, { align: 'center' });

        // Finalizar PDF
        doc.end();
    });
};

const generarResumenPDF = (data) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers));
        });

        // Título
        doc.fontSize(20).fillColor('#007BFF').text('Resumen de Destinatarios', { align: 'center', underline: true });
        doc.moveDown(1.5);

        // Tabla - Encabezado
        const tableTop = 150;
        const itemSpacing = 25;
        const headers = ["NIT", "Razón Social", "Correo"];

        // Encabezado
        doc.fillColor('#FFFFFF').fontSize(12).rect(50, tableTop - 10, 500, 20).fill('#007BFF');
        headers.forEach((header, i) => {
            doc.fillColor('#FFFFFF').text(header, 55 + i * 160, tableTop, { width: 160, align: 'center' });
        });

        // Agregar Datos
        let rowTop = tableTop + 20;
        data.forEach(item => {
            doc.fillColor('#FFFFFF').rect(50, rowTop - 10, 500, 20).fill('#F2F2F2');
            doc.fillColor('#333333').text(item.nit, 55, rowTop, { width: 160, align: 'center' });
            doc.text(item.razonsoc, 215, rowTop, { width: 160, align: 'center' });
            doc.text(item.correo, 375, rowTop, { width: 180, align: 'center' });
            rowTop += itemSpacing;
        });

        // Pie de Página
        doc.fillColor('#777777').fontSize(10).text('Este informe es generado automáticamente y es confidencial.', 0, rowTop + 40, { align: 'center' });

        // Finalizar PDF
        doc.end();
    });
};

module.exports = { generarReportePDF, generarResumenPDF };

