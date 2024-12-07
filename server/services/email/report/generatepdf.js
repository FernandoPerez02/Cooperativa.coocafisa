const PDFDocument = require('pdfkit');

const generarReportePDF = (data) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            resolve(Buffer.concat(buffers));
        });

        doc.registerFont('Times', "public/fonts/TIMES.TTF");
        const logoPath = "public/images/Logo.cooperativa.png";
        doc.image(logoPath, 50, 15, { width: 90 });

        const lineX = 175; 
        const lineTop = 30; 
        const lineBottom = 100;

        doc.strokeColor("#cccccc").lineWidth(1); 
        doc.moveTo(lineX, lineTop) 
            .lineTo(lineX, lineBottom) 
            .stroke(); 

        doc
            .fontSize(34)
            .font("Times-Bold")
            .fillColor("#35653D")
            .text("Reporte", 10, 45, { align: "center" });
            
        doc
            .circle(358, 60, 16)
            .fillColor("#0f3e22")
            .fill();
        doc
            .fontSize(20)
            .font("Times-Bold")
            .fillColor("#ffffff")
            .text("de", 170, 52, { align: "center" });

        doc
            .fontSize(50)
            .font("Times-Bold")
            .fillColor("#0f3e22")
            .text("Pagos", 35, 74, { align: "center" });

        doc
            .fontSize(12)
            .font("Times-Roman")
            .fillColor("#333333")
            .text(
                "Encontrarás a continuación un compendio de los pagos realizados a proveedores durante el periodo actual.",
                50,
                140,
                { align: "center", width: 500 }
            );

            const tableTop = 180;
            const itemSpacing = 20;
            const tableWidth = 575; // Ancho total del espacio disponible para la tabla
            const columnWidths = [80, 60, 80, 80, 60, 60, 60, 80, 80, 70]; // Ancho inicial de columnas
            
            // Ajustar proporciones para que encajen dentro de tableWidth
            const totalWidth = columnWidths.reduce((acc, w) => acc + w, 0);
            const scaleFactor = tableWidth / totalWidth;
            const adjustedWidths = columnWidths.map((width) => width * scaleFactor); // Ajustar los anchos
            
            // Dibujar fondo para encabezados
            doc
                .fillColor("#a8d08d")
                .rect(10, tableTop - 15, tableWidth, 40)
                .fill();
            
            // Encabezados de la tabla
            const headers = [
                "Nit",
                "Factura",
                "Fecha Factura",
                "Fecha Vencimiento",
                "Total",
                "Retención",
                "Neto",
                "Fecha Pago",
                "Pago Factura",
                "Valor Pago",
            ];
            
            // Dibujar encabezados
            let colXPos = 10; // Margen izquierdo
            doc.fontSize(10).fillColor("#323e2a");
            
            headers.forEach((header, i) => {
                doc.text(header, colXPos, tableTop, {
                    align: "center",
                    width: adjustedWidths[i], // Usar ancho ajustado
                });
                colXPos += adjustedWidths[i]; // Incrementar posición según el ancho ajustado
            });
            
            // Dibujar filas de datos
            let rowTop = tableTop + 35;
            
            data.forEach((item) => {
                doc.fillColor("#333333").fontSize(9); 
            
                const values = [
                    item.nit,
                    item.factura,
                    item.fecfac,
                    item.fecvcto,
                    item.total,
                    item.retencion,
                    item.tot,
                    item.fecpago,
                    item.pagfac,
                    item.pagtot,
                ];
            
                colXPos = 10; // Reiniciar posición horizontal para cada fila
                values.forEach((value, i) => {
                    doc.text(value, colXPos, rowTop, {
                        align: "center",
                        width: adjustedWidths[i], // Usar ancho ajustado
                    });
                    colXPos += adjustedWidths[i]; // Incrementar posición según el ancho ajustado
                });
            
                rowTop += itemSpacing; // Incrementar posición vertical para la siguiente fila
            });
            
            // Texto final del informe
            doc
                .fillColor("#777777")
                .fontSize(9) // Ajustar fuente para mensajes finales
                .text(
                    "Este informe es generado automáticamente y es confidencial.",
                    50,
                    rowTop + 40,
                    { align: "center", width: tableWidth }
                );
            
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

        doc.fontSize(20).fillColor('#007BFF').text('Resumen de Destinatarios', { align: 'center', underline: true });
        doc.moveDown(1.5);

        const tableTop = 150;
        const itemSpacing = 25;
        const headers = ["NIT", "Razón Social", "Correo"];

        doc.fillColor('#FFFFFF').fontSize(12).rect(50, tableTop - 10, 500, 20).fill('#007BFF');
        headers.forEach((header, i) => {
            doc.fillColor('#FFFFFF').text(header, 55 + i * 160, tableTop, { width: 160, align: 'center' });
        });

        let rowTop = tableTop + 20;
        data.forEach(item => {
            doc.fillColor('#FFFFFF').rect(50, rowTop - 10, 500, 20).fill('#F2F2F2');
            doc.fillColor('#333333').text(item.nit, 55, rowTop, { width: 160, align: 'center' });
            doc.text(item.razonsoc, 215, rowTop, { width: 160, align: 'center' });
            doc.text(item.correo, 375, rowTop, { width: 180, align: 'center' });
            rowTop += itemSpacing;
        });

        doc.fillColor('#777777').fontSize(10).text('Este informe es generado automáticamente y es confidencial.', 0, rowTop + 40, { align: 'center' });

        doc.end();
    });
};

module.exports = { generarReportePDF, generarResumenPDF };

