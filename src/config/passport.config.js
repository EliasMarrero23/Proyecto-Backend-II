import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config'; 

// IMPORTACIONES NECESARIAS DE REPOSITORIES
import UserRepository from '../repositories/UserRepository.js';
import CartRepository from '../repositories/CartRepository.js'; 


const JWT_SECRET = process.env.JWT_SECRET;

// Función auxiliar para extraer el token de la cookie
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken']; 
    }
    return token;
};

const initializePassport = () => {
    
    const cartRepositoryInstance = new CartRepository(); 
    const userRepositoryInstance = new UserRepository(); 

    // ESTRATEGIA DE REGISTRO

    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {
            try {
                // 1. Verificar si el usuario ya existe
                const exists = await userRepositoryInstance.getUserByEmail(email);
                if (exists) {
                    return done(null, false, { message: 'User already exists' });
                }

                // 2. CREAR EL CARRITO 
                const newCart = await cartRepositoryInstance.createCart(); 
                
                const user = req.body;
                
                // 3. Crear el usuario LIGADO al ID del carrito
                const newUser = await userRepositoryInstance.createUser({ 
                    ...user, 
                    cart: newCart._id 
                }); 
                
                return done(null, newUser);
            } catch (error) {
                console.error("Error during Passport register:", error);
                return done(error);
            }
        }
    ));

    // ESTRATEGIA DE LOGIN

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userRepositoryInstance.getUserByEmail(email); 

                if (!user) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const isValidPassword = bcrypt.compareSync(password, user.password);

                if (!isValidPassword) {
                    return done(null, false, { message: 'Invalid credentials' });
                }
                
                const token = jwt.sign({ 
                    _id: user._id, 
                    email: user.email, 
                    role: user.role, 
                    cart: user.cart 
                }, JWT_SECRET, { expiresIn: '1h' }); 
                
                user.token = token;

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    // ESTRATEGIA JWT (Ruta /current)

    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: JWT_SECRET,
        },
        async (jwt_payload, done) => {
            try {
                const user = await userRepositoryInstance.getUserById(jwt_payload._id); 
                
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));


    // Serialización/Deserialización

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userRepositoryInstance.getUserById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;