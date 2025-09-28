// src/routers/carts.router.js
import { Router } from 'express';
import passport from 'passport';
import { userAuth } from '../middlewares/authorization.js';
import CartController from '../controllers/CartController.js'; 

const cartsRouter = Router();

// Middleware de Passport para autenticación JWT
const passportAuth = passport.authenticate('jwt', { session: false });

// RUTAS PROTEGIDAS (Solo USUARIO)

// GET /api/carts/:cid - Obtener un carrito por ID
cartsRouter.get('/:cid', passportAuth, userAuth, CartController.getCartById);

// POST /api/carts/:cid/product/:pid - Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', passportAuth, CartController.addProductToCart);

// LÓGICA DE COMPRA AVANZADA

// POST /api/carts/:cid/purchase - Finalizar el proceso de compra
cartsRouter.post('/:cid/purchase', passportAuth, CartController.finalizePurchase);


export default cartsRouter;