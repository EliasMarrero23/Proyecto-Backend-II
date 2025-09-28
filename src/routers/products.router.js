// src/routers/products.router.js
import { Router } from 'express';
import passport from 'passport';
import { adminAuth } from '../middlewares/authorization.js';
import ProductController from '../controllers/ProductController.js';

const productsRouter = Router();

// Middleware de Passport para autenticación JWT (lo usamos en todas las rutas protegidas)
const passportAuth = passport.authenticate('jwt', { session: false });

// RUTAS PÚBLICAS O SOLO DE LECTURA 

// GET /api/products/ - Obtener todos los productos o con filtros
productsRouter.get('/', ProductController.getAllProducts);

// GET /api/products/:pid - Obtener un producto por ID
productsRouter.get('/:pid', ProductController.getProductById);

// RUTAS PROTEGIDAS (Solo ADMIN)

// POST /api/products/ - Crear un nuevo producto
// Requiere: 1. Autenticación con Token (Passport) 2. Rol 'admin' (adminAuth)
productsRouter.post('/', passportAuth, adminAuth, ProductController.createProduct);

// PUT /api/products/:pid - Actualizar un producto por ID
// Requiere: 1. Autenticación con Token 2. Rol 'admin'
productsRouter.put('/:pid', passportAuth, adminAuth, ProductController.updateProduct);

// DELETE /api/products/:pid - Eliminar un producto por ID
// Requiere: 1. Autenticación con Token 2. Rol 'admin'
productsRouter.delete('/:pid', passportAuth, adminAuth, ProductController.deleteProduct);


export default productsRouter;