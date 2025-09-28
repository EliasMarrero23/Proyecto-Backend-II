import CartRepository from '../repositories/CartRepository.js';

class CartService {
    constructor() {
        this.cartRepository = new CartRepository(); 
    }

    async getCartById(cid) {
        return await this.cartRepository.getCartById(cid);
    }
    
    async addProduct(cid, pid, quantity) {
        // Usa la instancia para buscar el carrito
        const cart = await this.cartRepository.getCartById(cid); 
        if (!cart) {
            throw new Error(`Cart with ID ${cid} not found.`);
        }
        
        // Usa la instancia para agregar el producto
        return await this.cartRepository.addProductToCart(cid, pid, quantity);
    }
    
    async updateProductsInCart(cid, products) {
        return await this.cartRepository.updateProducts(cid, products);
    }
}

export default CartService;