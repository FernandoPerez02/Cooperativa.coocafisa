const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const accountTransport = require("../../env/account_transport.json");

const transporter = async () => {
  const oauth2Client = new google.auth.OAuth2(
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
    throw error;
  }
};

const emailSend = async (data, pdfBuffer) => {
  try {
    const transport = await transporter();
    const { nit, razonsoc, fecpago, correo } = data[0];

    const mailOptions = {
      from: "contacto@coocafisa.com",
      to: correo,
      subject: "Informe diario",
      text: "El presente correo contiene un informe PDF de sus registros que tienen por fecha de pago el día de hoy.",
      attachments: [
        {
          filename: `${nit}_${razonsoc}_${fecpago}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    return error;
  }
};

const sendNotificationEmail = async (count, pdfBuffer) => {
  try {
    const transport = await transporter();
    const notificationOptions = {
      from: "contacto@coocafisa.com",
      to: "contacto@coocafisa.com",
      subject: "Notificación: Correos Enviados",
      text: `Se han enviado un total de ${count} correos con informes exitosamente. Adjuntamos la lista completa de destinatarios.`,
      attachments: [
        {
          filename: "Resumen_Destinatarios.pdf",
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    await transport.sendMail(notificationOptions);

  } catch (error) {
    return error;
  }
};

module.exports = { emailSend, sendNotificationEmail, transporter };

