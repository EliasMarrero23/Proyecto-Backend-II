// imports 
import express from 'express';
import mongoose from 'mongoose';
import sessionsRouter from './src/routes/sessions.router.js'; 
import passport from 'passport';
import cookieParser from 'cookie-parser';
import passportConfig from './src/config/passport.config.js'; 

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// esto es la conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log(err));

// inicializa passport
passportConfig; 
app.use(passport.initialize());

// rutass
app.use('/api/sessions', sessionsRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));