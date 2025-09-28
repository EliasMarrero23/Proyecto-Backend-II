// src/services/UserService.js
import UserRepository from '../repositories/UserRepository.js';
import { sendPasswordResetEmail } from '../utils/mailing.js'; // Función que crearemos en utils
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config'; // Asegúrate de cargar .env

const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;

class UserService {
    // ------------------------------------------
    // LÓGICA DE RECUPERACIÓN DE CONTRASEÑA
    // ------------------------------------------

    async requestPasswordReset(email) {
        // En un proyecto real, se usaría getUserByEmail sin DTO para obtener el hash, 
        // pero usaremos el Repositorio aquí y asumiremos que obtenemos el ID/Email
        const user = await UserRepository.getSafeUserByEmail(email); 
        
        if (!user) {
            // No revelamos si el correo existe por seguridad. Simplemente retornamos éxito.
            return { status: 'success', message: 'If the user exists, an email has been sent.' };
        }

        // 1. Generar token con expiración de 1 hora (Criterio de la consigna)
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_RESET_SECRET, { expiresIn: '1h' });

        // 2. Enviar correo con el enlace
        await sendPasswordResetEmail(email, token);

        return { status: 'success', message: 'Password reset link sent.' };
    }

    async resetPassword(email, newPassword) {
        // NOTA: Asume que el Controller ya verificó que el token sea válido.
        const userWithHash = await UserRepository.getUserByEmailForReset(email); // Necesitas un método en Repo/DAO que devuelva el hash

        if (!userWithHash) {
             throw new Error('User not found.');
        }

        // 1. Evitar que la nueva contraseña sea igual a la anterior (Criterio de la consigna)
        const isSamePassword = bcrypt.compareSync(newPassword, userWithHash.password);
        if (isSamePassword) {
            throw new Error('The new password cannot be the same as the previous one.');
        }

        // 2. Actualizar la contraseña (el DAO/Mongoose se encargará de hashearla de nuevo)
        await UserRepository.updatePassword(email, newPassword);

        return { status: 'success', message: 'Password updated successfully.' };
    }
    
    // ... aquí puedes incluir la lógica de register y login
}

export default new UserService();