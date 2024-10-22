const express = require('express');
const router = express.Router();
const pool = require('../../connectionBD/db');
const transporter = require('../email/emailscheduler');
const bcrypt = require('bcrypt');

const renderAlert = (res, alertTitle, alertMessage, alertIcon, timer, ruta, plantilla) => {
    res.render(plantilla, {
        alert: true,
        alertTitle: alertTitle,
        alertMessage: alertMessage,
        alertIcon: alertIcon,
        timer: timer,
        ruta: ruta,
        plantilla: plantilla
    });
};

const resetMail = async (email) => {
    try {
        const transport = await transporter();
        const mailOptions = {
            from: 'soporte.coocafisa@gmail.com',
            to: email,
            subject: 'Restablecimiento de Contraseña',
            text: 'Ingresa al siguiente link para cambiar tu contraseña: [http://localhost:3000/reste]',
        };

        await transport.sendMail(mailOptions);
        console.log('Correo de restablecimiento enviado.');
        return true;
    } catch (error) {
        console.error('Error al enviar el restablecimiento de contraseña:', error);
        return false;
    }
};

router.post('/emailresetpass', async (req, res) => {
    const gmail = req.body.gmail;
    const user = req.body.nit;

    if (!gmail || !user) {
        return renderAlert(res, 'Error', 'Por favor ingresar un correo para continuar.',
            'error', 1500, 'resetpassword', 'reset_password');
    }

    try {
        const [users] = await pool.query('SELECT * FROM usuarios WHERE correo = ? and nit = ?', [gmail, user]);
        
        if (users.length > 0) {
            const emailSent = await resetMail(gmail);
            if (emailSent) {
                return renderAlert(res, 'Proceso Exitoso',
                    'Correo enviado exitosamente. Revisa tu bandeja de entrada.',
                    'success', 2000, '/', 'reset_password');
            } else {
                return renderAlert(res, 'Error', 'Error al enviar el correo.',
                    'error', 1500, 'resetpassword', 'reset_password');
            }
        } else {
            return renderAlert(res, 'Error', 'No se encontraron registros con el correo ingresado.',
                'error', 1500, 'resetpassword', 'reset_password');
        }
    } catch (error) {
        console.error('Error en la consulta de la base de datos:', error);
        return renderAlert(res, 'Error', 'Ocurrió un error interno. Inténtalo más tarde.',
            'error', 1500, 'resetpassword', 'reset_password');
    }
});

router.post('/resetpass', async (req, res) => {
    const validatepass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{2})(?!.*\s)[\w!@#$%^&*(),.?":{}|<>]{8,16}$/;
    const { newpass, confpass, nit } = req.body;

    try {
        if (!validatepass.test(newpass)) {
            return renderAlert(res, 'Error',
                'La contraseña no es segura. Ten en cuenta las recomendaciones.',
                'error', 1500, 'reste', 'resetform');
        }

        if (newpass !== confpass) {
            return renderAlert(res, 'Error', 'Las contraseñas no coinciden. Inténtalo nuevamente.',
                'error', 1500, 'reste', 'resetform');
        }

        const hashedPassword = await bcrypt.hash(newpass, 10);
        const sql = 'UPDATE usuarios SET clave = ? WHERE nit = ?';
        const [result] = await pool.query(sql, [hashedPassword, nit]);

        if (result.affectedRows === 0) {
            return renderAlert(res, 'Error', 'No se encontró el usuario con el NIT proporcionado.',
                'error', 1500, 'reste', 'resetform');
        }

        return renderAlert(res, 'Proceso Exitoso',
            'Tu contraseña ha sido restablecida exitosamente. Inicia sesión con tus nuevas credenciales.',
            'success', 2000, '/', 'resetform');

    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return renderAlert(res, 'Error',
            'Hubo un problema al restablecer tu contraseña. Inténtalo más tarde.',
            'error', 1500, 'reste', 'resetform');
    }
});

module.exports = router;