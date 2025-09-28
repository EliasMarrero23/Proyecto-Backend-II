// src/dao/ProductDAO.js
import Product from '../models/Product.js';

class ProductDAO {
    async getAll(queryOptions) {
        return await Product.find(queryOptions).lean();
    }

    async getById(id) {
        return await Product.findById(id).lean();
    }

    async create(productData) {
        return await Product.create(productData);
    }

    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id).lean();
    }
    
    // Método CRUCIAL para la lógica de compra
    async updateStock(id, newStock) {
        return await Product.findByIdAndUpdate(id, { stock: newStock }, { new: true }).lean();
    }
}
export default new ProductDAO();