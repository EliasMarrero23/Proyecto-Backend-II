// src/controllers/CartController.js
import CartService from '../services/CartService.js';       // Asumimos que lo crearás
import PurchaseService from '../services/PurchaseService.js'; // Asumimos que lo crearás

class CartController {
    
    // Leer carrito por ID
    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            // Podrías añadir una validación aquí para que el usuario solo pueda ver su carrito
            const cart = await CartService.getCartById(cid);
            if (!cart) {
                return res.status(404).json({ status: 'error', error: 'Cart not found' });
            }
            res.status(200).json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // Agregar producto al carrito
    async addProductToCart(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity = 1 } = req.body;
            
            // Aquí se valida el rol de usuario por el middleware, no es necesario aquí.

            const updatedCart = await CartService.addProduct(cid, pid, quantity);
            res.status(200).json({ status: 'success', payload: updatedCart });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // Finalizar Compra (Lógica Avanzada de la Consigna)
    async finalizePurchase(req, res) {
        try {
            const { cid } = req.params;
            const userEmail = req.user.email; // El email lo obtenemos de req.user (gracias a Passport)
            
            // El PurchaseService maneja la lógica de stock, ticket y actualización del carrito
            const result = await PurchaseService.finalizePurchase(cid, userEmail);

            if (result.status === 'incomplete') {
                return res.status(202).json({ 
                    status: 'incomplete', 
                    message: result.message, 
                    products_out_of_stock: result.outOfStock 
                });
            }

            res.status(200).json({ 
                status: 'success', 
                message: 'Purchase completed successfully', 
                ticket: result.ticket, 
                products_out_of_stock: result.outOfStock 
            });

        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // ... otros métodos como eliminar producto, vaciar carrito, etc.
}

export default new CartController();