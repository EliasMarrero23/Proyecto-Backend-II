// src/repositories/ProductRepository.js
import ProductDAO from '../dao/ProductDAO.js';

class ProductRepository {
    async getAllProducts(options) {
        return await ProductDAO.getAll(options);
    }

    async getProductById(id) {
        return await ProductDAO.getById(id);
    }

    async createProduct(data) {
        return await ProductDAO.create(data);
    }
    
    async updateProduct(id, data) {
        return await ProductDAO.update(id, data);
    }

    async deleteProduct(id) {
        return await ProductDAO.delete(id);
    }
    
    async updateStock(id, newStock) {
        return await ProductDAO.updateStock(id, newStock);
    }
}
export default ProductRepository;