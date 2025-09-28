// src/controllers/SessionController.js
import UserService from '../services/UserService.js'; 
import UserDTO from '../utils/UserDTO.js'; // Para la ruta /current
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;

class SessionController {
    
    // Asume que la estrategia de Passport 'register' ya creó el usuario
    async register(req, res) {
        // req.user contiene el usuario creado (DTO o modelo, depende de tu Passport config)
        res.status(201).send({ status: 'success', message: 'User registered successfully', payload: req.user });
    }

    // Asume que la estrategia de Passport 'login' ya validó las credenciales
    async login(req, res) {
        // Aquí debes generar el JWT de sesión para la cookie o header
        // Asegúrate de que tu JWT de sesión NO incluya la contraseña
        res.cookie('coderCookieToken', req.user.token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.send({ status: 'success', message: 'Login successful', payload: req.user });
    }

    // Criterio de la consigna: Usar DTO para información no sensible
    async getCurrentUser(req, res) {
        // req.user es el usuario des-serializado por la estrategia 'jwt' o 'current'
        
        // Usamos el DTO para garantizar que la información enviada es segura y limitada
        const safeUser = new UserDTO(req.user);
        
        res.send({ status: 'success', payload: safeUser });
    }
    
    // Criterio de la consigna: Solicitar restablecimiento de contraseña
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            // El servicio se encarga de crear el token de 1h y enviar el correo
            const result = await UserService.requestPasswordReset(email);
            
            res.send(result);
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // Criterio de la consigna: Restablecer la contraseña
    async resetPassword(req, res) {
        const { token, newPassword } = req.body;
        
        try {
            // 1. Verificar y decodificar el token de restablecimiento
            const decoded = jwt.verify(token, JWT_RESET_SECRET);
            const userEmail = decoded.email;
            
            // 2. Llamar al servicio para cambiar la contraseña (el servicio maneja la validación de contraseña anterior)
            const result = await UserService.resetPassword(userEmail, newPassword);

            res.send(result);
        } catch (error) {
            // Manejo de token expirado o inválido
            if (error.name === 'TokenExpiredError') {
                return res.status(400).send({ status: 'error', message: 'The recovery link has expired. Please request a new one.' });
            }
            if (error.message.includes('password')) {
                 return res.status(400).send({ status: 'error', message: error.message }); // Contraseña igual a la anterior
            }
            res.status(500).send({ status: 'error', message: 'Invalid token or server error.' });
        }
    }
}
export default new SessionController();