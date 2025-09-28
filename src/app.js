import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io'; 

// CARGA DE VARIABLES DE ENTORNO
//necesario el .env
import 'dotenv/config'; 

// IMPORTAR CONFIGURACIÓN Y RUTAS ACTUALIZADAS
import initializePassport from './config/passport.config.js'; 
import sessionsRouter from './routers/sessions.router.js'; 
import productsRouter from './routers/products.router.js'; 
import cartsRouter from './routers/carts.router.js';       

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware General
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración e Inicialización de Passport
initializePassport(); 
app.use(passport.initialize());

// Conexión a MongoDB (Usa la variable de entorno MONGO_URL)
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ Conectado a la base de datos.'))
    .catch(err => console.log('❌ Error al conectar a la base de datos:', err));

// Uso de Routers
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter); 
app.use('/api/carts', cartsRouter);       

// Listener
const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

export default app;