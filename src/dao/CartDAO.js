// src/dao/CartDAO.js
import Cart from '../models/Cart.js'; 

class CartDAO {
    async create(cartData = {}) {
        const newCart = await Cart.create(cartData);
        return newCart;
    }

    async getById(id) {
        // Incluye populate para los productos
        const cart = await Cart.findById(id).populate('products.product'); 
        return cart;
    }
    
    async update(id, data) {
        // Usamos findByIdAndUpdate para operaciones generales en el carrito
        const updatedCart = await Cart.findByIdAndUpdate(id, data, { new: true });
        return updatedCart;
    }

    async delete(id) {
        return await Cart.findByIdAndDelete(id);
    }
}

export default CartDAO;