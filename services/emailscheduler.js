const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const accountTransport = require("./account_transport.json");
const ejs = require('ejs');
const fs = require('fs');
const htmlPdf = require('html-pdf');
const path = require('path');
const { rejects } = require('assert');
const {formatDate} = require('./globalfunctions.js');

const transporter = async () => {
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground",
    );
    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
    });

    try {
        const { token } = await oauth2Client.getAccessToken();
        accountTransport.auth.accessToken = token;
        return nodemailer.createTransport(accountTransport);
    } catch (error) {
        console.log('Error al obtener el token de acceso', error);
        throw error;
    }
};

const obtainData = () => {
    const connection = require('../connectionBD/db.js');
    const query = `SELECT nit, empresa, descuento, retencion, pago, fecha_pago, email FROM usuario WHERE fecha_pago = CURDATE()`;
    
    connection.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener los datos', error);
            return;
        }
        if (results.length > 0) {
            const formattedResults = results.map(result => ({
                ...result,
                fecha_pago: formatDate(result.fecha_pago)
            }));
            const groupedResults = formattedResults.reduce((acc, current) => {
                (acc[current.nit] = acc[current.nit] || []).push(current);
                return acc;
            }, {});
            Object.keys(groupedResults).forEach(nit => {
                emailSend(groupedResults[nit]);
            });
        } else {
            console.log('No hay registros para la fecha actual');
        }
    });
};

const reportsDir = path.join(__dirname, '../public/reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

const generatePDF = async (data, nit, empresa, fecha_pago) => {
    try {
        const filePath = path.join(__dirname, '../public/views/reporte.ejs');
        const htmlString = await ejs.renderFile(filePath, { data});
        console.log('HTML Generado:', htmlString);

        const reportingname = `${nit}_${empresa}_${fecha_pago}.pdf`;
        const routereport = path.join(reportsDir, reportingname);
        await new Promise((resolve, reject)=>{
            htmlPdf.create(htmlString).toFile(routereport, (err, res) =>{
                if (err) {
                    return reject(err);
                }
                console.log('PDF generado con exito', res.filename);
                resolve(res);
            });
        });
    } catch (err) {
        console.log('Error al generar el PDF:', err);
        throw err;
    }
};

const emailSend = async (data) => {
    try {
        const { nit, empresa, fecha_pago, email } = data[0];
        const pdfPath = await generatePDF(data, nit, empresa, formatDate(fecha_pago));
        const transport = await transporter();
        const mailOptions = {
            from: 'soporte.coocafisa@gmail.com',
            to: email,
            subject: 'Informe diario',
            text: 'El presente correo contiene un imforme PDF de sus registros que tienen por fecha de pago el dia de hoy.',
            attachments: [
                {
                filename: `${nit}_${empresa}_${fecha_pago}.pdf`,
                path: pdfPath,
                },
            ],
        };
        await transport.sendMail(mailOptions);
    } catch (error) {
        console.log('Error al enviar el correo:', error);
    } 
};


// programacion de envio de correo
schedule.scheduleJob('50 9 * * *', obtainData);
