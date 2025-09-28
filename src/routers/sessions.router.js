// src/routers/sessions.router.js
import { Router } from 'express';
import passport from 'passport';
import SessionController from '../controllers/SessionController.js'; 

const sessionsRouter = Router();

// RUTAS DE AUTENTICACIÓN

// POST /api/sessions/register
sessionsRouter.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) {
            // Error interno
            return res.status(500).json({ status: 'error', error: err.message });
        }
        if (!user) {
            // Fallo de autenticación (ej. usuario ya existe o falta un campo)
            return res.status(400).json({ status: 'error', error: info.message || 'Registration failed' });
        }
        
        // Éxito: El usuario fue creado
        return res.status(201).json({ status: 'success', message: 'User registered successfully', payload: user });

    })(req, res, next);
});

// POST /api/sessions/login
sessionsRouter.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ status: 'error', error: err.message });
        }
        if (!user) {
            // Fallo de autenticación (ej. credenciales incorrectas)
            return res.status(401).json({ status: 'error', error: info.message || 'Invalid credentials' });
        }
        
        // Éxito: El usuario fue autenticado y el JWT está en req.user.token (configurado en passport.config.js)
        
        // 1. Establecer la cookie JWT
        res.cookie('coderCookieToken', user.token, { maxAge: 60 * 60 * 1000, httpOnly: true });

        // 2. Enviar respuesta de éxito
        return res.status(200).json({ status: 'success', message: 'Login successful', payload: user });

    })(req, res, next);
});

// GET /api/sessions/current (Criterio de la consigna)
// Usa la estrategia JWT/current para obtener el usuario autenticado
sessionsRouter.get('/current', passport.authenticate('jwt', { session: false }), SessionController.getCurrentUser); 

// RUTAS DE RECUPERACIÓN DE CONTRASEÑA

// POST /api/sessions/forgotPassword - Recibe el email y envía el link
sessionsRouter.post('/forgotPassword', SessionController.forgotPassword);

// POST /api/sessions/resetPassword - Recibe token y nueva contraseña
sessionsRouter.post('/resetPassword', SessionController.resetPassword);

// RUTAS DE FALLO (Opcionales, para manejo de errores de Passport)

sessionsRouter.get('/faillogin', (req, res) => {
    res.status(401).send({ status: 'error', error: 'Failed to log in' });
});

sessionsRouter.get('/failregister', (req, res) => {
    res.status(500).send({ status: 'error', error: 'Failed to register' });
});

export default sessionsRouter;