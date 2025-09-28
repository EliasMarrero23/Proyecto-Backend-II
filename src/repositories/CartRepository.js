// src/repositories/CartRepository.js (CÓDIGO CORREGIDO Y FINAL)

import CartDAO from '../dao/CartDAO.js'; 

class CartRepository {
    constructor() {
        this.dao = new CartDAO();
    }

    async getCartById(cid) {
        return await this.dao.getById(cid); 
    }

    async addProductToCart(cid, pid, quantity) {
        return await this.dao.updateProducts(cid, pid, quantity); 
    }
    
    async updateProducts(cid, productsArray) {
        return await this.dao.update(cid, { products: productsArray }); 
    }

    async createCart() {
        return await this.dao.create();
    }
    async addProduct(cid, pid, quantity) {
        return await this.dao.addProduct(cid, pid, quantity); 
    }
}

export default CartRepository;