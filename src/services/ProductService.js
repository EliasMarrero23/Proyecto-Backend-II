import ProductRepository from '../repositories/ProductRepository.js'; 

class ProductService {
    constructor() {
        this.productRepository = new ProductRepository(); 
    }

    // CRUD: Crear
    async create(productData) {
        return await this.productRepository.createProduct(productData);
    }

    // CRUD: Leer todos
    async getAll(queryOptions) {
        return await this.productRepository.getAllProducts(queryOptions);
    }

    // CRUD: Obtener por ID
    async getById(id) {
        return await this.productRepository.getProductById(id);
    }

    // CRUD: Actualizar producto
    async update(id, updatedData) {
        const product = await this.productRepository.getProductById(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found.`);
        }
        
        return await this.productRepository.updateProduct(id, updatedData);
    }

    // CRUD: Eliminar producto
    async delete(id) {
        await this.productRepository.deleteProduct(id);
    }
    
    // Método clave para la lógica de compra: Actualizar Stock
    async updateStock(productId, newStock) {
        if (newStock < 0) {
            throw new Error('Stock cannot be negative.');
        }
        return await this.productRepository.updateStock(productId, newStock);
    }
}

export default ProductService;