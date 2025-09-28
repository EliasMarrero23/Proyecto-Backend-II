// src/utils/mailing.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

// 1. Configurar el transportador (usando credenciales de .env)
const transporter = nodemailer.createTransport({
    service: 'gmail', // O el que uses (ej. SendGrid, Mailgun)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendPasswordResetEmail = async (userEmail, token) => {
    // URL que el usuario debe clickear para restablecer la contraseña
    const resetLink = `http://localhost:8080/reset-password?token=${token}`; 

    const mailOptions = {
        from: `Ecommerce App <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Restablecimiento de Contraseña',
        html: `
            <h1>Restablecimiento de Contraseña</h1>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar. Este enlace expirará en 1 hora.</p>
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Restablecer Contraseña
            </a>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email de restablecimiento enviado a ${userEmail}`);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('Could not send reset email.');
    }
};