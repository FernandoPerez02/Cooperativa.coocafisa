const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const { google } = require('googleapis');
const { OAuth2 }  = google.auth;
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const { formatDate } = require('../functions/helpers'); 
const pool = require('../../connectionBD/db');
const accountTransport = require('./account_transport.json');

const transporter = async () => {
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
    });

    try {
        const { token } = await oauth2Client.getAccessToken();
        accountTransport.auth.accessToken = token;
        return nodemailer.createTransport(accountTransport);
    } catch (error) {
        console.error('Error al obtener el token de acceso', error);
        throw error;
    }
};

module.exports = transporter;

const obtainData = async () => {
    const query = `SELECT pagos.nit, razonsoc, descuento, retencion, total, fecpago, correo
                FROM usuarios inner join pagos on usuarios.nit = pagos.nit WHERE fecpago = CURDATE()`;
    try {
        const [results] = await pool.query(query);
        if (results.length > 0) {
            const formattedResults = results.map(result => ({
                ...result,
                fecpago: formatDate(result.fecpago),
            }));

            const groupedResults = formattedResults.reduce((acc, current) => {
                if (!acc[current.nit]) acc[current.nit] = [];
                acc[current.nit].push(current);
                return acc;
            }, {});

            const emailsSent = [];
            await Promise.all(
                Object.keys(groupedResults).map(async (nit) => {
                    const data = groupedResults[nit];
                    emailsSent.push(...data);
                    await emailSend(data); 
                })
            );

            const pdfPath = await generateRecipientPDF(emailsSent);
            await sendNotificationEmail(emailsSent.length, pdfPath);

            console.log('Todos los correos fueron enviados exitosamente.');
        } else {
            console.log('No hay registros para la fecha actual.');
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
};

const reportsDir = path.join(__dirname, '../../public/reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

const getImageBase64 = (imagePath) => {
    try {
        const image = fs.readFileSync(imagePath);
        return `data:image/png;base64,${image.toString('base64')}`;
    } catch (error) {
        console.error('Error al leer la imagen:', error);
        throw error;
    }
};

const generatePDF = async (data, nit, razonsoc, fecpago) => {
    try {
        const filePath = path.join(__dirname, '../../public/views/reporte.ejs');
        const logoPath = path.join(__dirname, '../../public/images/Logo.cooperativa.png');
        const logoBase64 = getImageBase64(logoPath);

        const htmlString = await ejs.renderFile(filePath, { data, logo: logoBase64 });

        if (!htmlString) {
            throw new Error('El contenido HTML está vacío');
        }

        const dateFormate = fecpago.replace(/\//g, '-');
        const reportingName = `${nit}_${razonsoc}_${dateFormate}.pdf`;
        const routeReport = path.join(reportsDir, reportingName);
        fs.mkdirSync(path.dirname(routeReport), { recursive: true });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlString, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: routeReport,
            format: 'A4',
            printBackground: true,
        });
        await browser.close();

        console.log('PDF generado con éxito:', routeReport);
        return routeReport;
    } catch (err) {
        console.error('Error al generar el PDF:', err);
        throw err;
    }
};

const emailSend = async (data) => {
    try {
        const { nit, razonsoc, fecpago, correo } = data[0];
        const pdfPath = await generatePDF(data, nit, razonsoc, formatDate(fecpago));
        const transport = await transporter(); 

        const mailOptions = {
            from: 'soporte.coocafisa@gmail.com',
            to: correo,
            subject: 'Informe diario',
            text: 'El presente correo contiene un informe PDF de sus registros que tienen por fecha de pago el día de hoy.',
            attachments: [
                {
                    filename: `${nit}_${razonsoc}_${fecpago}.pdf`,
                    path: pdfPath,
                },
            ],
        };

        await transport.sendMail(mailOptions);
        console.log(`Correo enviado a: ${correo}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

const sendNotificationEmail = async (count, pdfPath) => {
    try {
        const transport = await transporter();
        const notificationOptions = {
            from: 'soporte.coocafisa@gmail.com',
            to: 'luis.osorio@coocafisa.com', 
            subject: 'Notificación: Correos Enviados',
            text: `Se han enviado un total de ${count} correos con informes exitosamente. Adjuntamos la lista completa de destinatarios.`,
            attachments: [
                {
                    filename: 'Resumen_Destinatarios.pdf',
                    path: pdfPath,
                },
            ],
        };

        await transport.sendMail(notificationOptions);
        console.log('Correo de notificación enviado exitosamente.');
    } catch (error) {
        console.error('Error al enviar la notificación:', error);
    }
};

const generateRecipientPDF = async (emails) => {
    try {
        const filePath = path.join(__dirname, '../../public/views/reporte.ejs');
        const logoPath = path.join(__dirname, '../../public/images/Logo.cooperativa.png');
        const logoBase64 = getImageBase64(logoPath);
        const htmlString = await ejs.renderFile(filePath, { data: emails, logo: logoBase64 });

        if (!htmlString) {
            throw new Error('El contenido HTML está vacío');
        }

        const pdfPath = path.join(reportsDir, `Resumen_Destinatarios_${Date.now()}.pdf`);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlString, { waitUntil: 'networkidle0' });
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
        });
        await browser.close();

        console.log('PDF de notificación generado con éxito:', pdfPath);
        return pdfPath;
    } catch (err) {
        console.error('Error al generar el PDF de notificación:', err);
        throw err;
    }
};

schedule.scheduleJob('35 15 * * *', obtainData);