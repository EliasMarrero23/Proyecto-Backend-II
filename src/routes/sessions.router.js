import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const sessionsRouter = Router();

// ruta para el registro
sessionsRouter.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    const newUser = new User({ first_name, last_name, email, age, password });
    await newUser.save();
    res.status(201).send({ status: 'success', message: 'Usuario creado' });
  } catch (error) {
    res.status(500).send({ status: 'error', error: error.message });
  }
});

// ruta del login
sessionsRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ status: 'error', error: 'Usuario no encontrado' });
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ status: 'error', error: 'Credenciales inválidas' });
    }
    const user_info = {
      _id: user._id,
      email: user.email,
      role: user.role
    };
    const token = jwt.sign({ user: user_info }, 'tu_secreto_para_jwt', { expiresIn: '1h' });
    res.cookie('jwtCookieToken', token, {
      maxAge: 3600000,
      httpOnly: true
    }).send({ status: 'success', message: '¡Login realizado correctamente!' });
  } catch (error) {
    res.status(500).send({ status: 'error', error: error.message });
  }
});

// ruta para la validación /current
sessionsRouter.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send({ status: 'success', payload: req.user });
});

export default sessionsRouter;