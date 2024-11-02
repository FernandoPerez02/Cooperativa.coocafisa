const express = require('express');
const router = express.Router();
const pool = require('../../../connectionBD/db');
const transporter = require('../emailscheduler');
const bcrypt = require('bcrypt');

const resetMail = async (email) => {
    try {
        const transport = await transporter();
        const mailOptions = {
            from: 'soporte.coocafisa@gmail.com',
            to: email,
            subject: 'Restablecimiento de Contraseña',
            text: 'Ingresa al siguiente link para cambiar tu contraseña: [http://localhost:3000/users/resetpassword/formpass]',
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
        return res.status(400).json({
            message: "'Por favor ingresar un correo para continuar.",
        });
    }

    try {
        const [users] = await pool.query('SELECT * FROM usuarios WHERE correo = ? and nit = ?', [gmail, user]);
        
        if (users.length > 0) {
            const emailSent = await resetMail(gmail);
            if (emailSent) {
                return res.status(201).json({
                    message: "Correo enviado exitosamente. Revisa tu bandeja de entrada.",
                });
            } else {
                return res.status(400).json({
                    message: "Error al enviar el correo.",
                });
            }
        } else {
            return res.status(400).json({
                message: "Una de las credenciales no es correcta.",
            });
        }
    } catch (error) {
        console.error('Error en la consulta de la base de datos:', error);
        return res.status(400).json({
            message: "Ocurrió un error interno. Inténtalo más tarde.",
        });
    }
});


// Formulario de restablecimiento de contraseña.
router.post('/resetpass', async (req, res) => {
    const validatepass = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d{2})(?!.*\s)[\w!@#$%^&*(),.?":{}|<>]{8,16}$/;
    const { newpass, confpass, nit } = req.body;

    try {
        if (!validatepass.test(newpass)) {
            return res.status(400).json({
                message: "La contraseña no es segura. Ten en cuenta las recomendaciones.",
            });
        }

        if (newpass !== confpass) {
            return res.status(400).json({
                message: "Las contraseñas no coinciden. Inténtalo nuevamente.",
            });
        }

        const hashedPassword = await bcrypt.hash(newpass, 10);
        const sql = 'UPDATE usuarios SET clave = ? WHERE nit = ?';
        const [result] = await pool.query(sql, [hashedPassword, nit]);

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "No se encontró el usuario con el NIT proporcionado.",
            });
        }

        return res.status(201).json({
            message: "Tu contraseña ha sido restablecida exitosamente. Inicia sesión con tus nuevas credenciales.",
        });
    } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
        return res.status(400).json({
            message: "Hubo un problema al restablecer tu contraseña. Inténtalo más tarde.",
        });
    }
});

module.exports = router;