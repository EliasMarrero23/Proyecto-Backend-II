// src/services/PurchaseService.js

import TicketRepository from '../repositories/TicketRepository.js';
import CartService from './CartService.js'; 
import ProductService from './ProductService.js';

// Instanciar el Repositorio de Tickets
const ticketRepositoryInstance = new TicketRepository();
// Instanciar los Services que vamos a usar
const cartServiceInstance = new CartService();
const productServiceInstance = new ProductService();

class PurchaseService {
    
    // Método principal para finalizar la compra
    async finalizePurchase(cid, userEmail) {
        
        const cart = await cartServiceInstance.getCartById(cid);
        if (!cart) {
            throw new Error('Cart not found.');
        }

        const productsToPurchase = [];
        const productsOutStock = [];
        let totalAmount = 0;

        // 1. Procesar cada producto en el carrito
        for (const item of cart.products) {
            const productDB = await productServiceInstance.getById(item.product._id);
            const requestedQuantity = item.quantity;
            
            if (!productDB) {
                // Producto no existe, se salta
                productsOutStock.push(item);
                continue; 
            }

            // 2. Verificar Stock
            if (productDB.stock >= requestedQuantity) {
                // Hay stock: Agregar a la compra y actualizar stock
                productsToPurchase.push({
                    product: productDB._id,
                    quantity: requestedQuantity,
                    price: productDB.price,
                    title: productDB.title // Info extra para el ticket
                });

                totalAmount += productDB.price * requestedQuantity;

                // 3. Descontar Stock
                const newStock = productDB.stock - requestedQuantity;
                await productServiceInstance.updateStock(productDB._id, newStock);

            } else {
                // No hay stock: Mover a la lista de productos sin stock
                productsOutStock.push(item);
            }
        }

        // 4. Si algo se compró, crear el Ticket
        let ticket = null;
        if (productsToPurchase.length > 0) {
            
            // ➡️ Solución 1 al Error: Generar campo 'code' único
            const uniqueCode = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);

            const ticketData = {
                code: uniqueCode, 
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userEmail,
                // ➡️ Solución 2 al Error: Mapear productos para el Ticket 
                products: productsToPurchase.map(p => ({
                    product: p.product, // Asegura que solo envías el ID
                    quantity: p.quantity,
                    price: p.price
                }))
            };

            ticket = await ticketRepositoryInstance.createTicket(ticketData);
        }

        // 5. Actualizar el carrito (dejar solo los productos sin stock)
        const updatedCart = await cartServiceInstance.updateProductsInCart(cid, productsOutStock);
        
        // 6. Devolver resultados
        return {
            status: productsToPurchase.length > 0 ? 'success' : 'incomplete',
            message: productsToPurchase.length > 0 ? 'Purchase completed.' : 'Some products were out of stock.',
            ticket: ticket,
            outOfStock: productsOutStock.map(item => ({
                product_id: item.product._id,
                quantity_failed: item.quantity
            }))
        };
    }
}

export default new PurchaseService();