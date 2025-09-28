import ProductService from '../services/ProductService.js'; 

class ProductController {
    // CRUD: Crear
    async createProduct(req, res) {
        try {
            const newProductData = req.body;
            const newProduct = await ProductService.create(newProductData);
            res.status(201).json({ status: 'success', payload: newProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // CRUD: Leer todos
    async getAllProducts(req, res) {
        try {
            const products = await ProductService.getAll(req.query); 
            res.status(200).json({ status: 'success', payload: products });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // CRUD: Leer uno
    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const product = await ProductService.getById(pid);
            if (!product) {
                return res.status(404).json({ status: 'error', error: 'Product not found' });
            }
            res.status(200).json({ status: 'success', payload: product });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // CRUD: Actualizar
    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updatedData = req.body;
            const updatedProduct = await ProductService.update(pid, updatedData);
            res.status(200).json({ status: 'success', payload: updatedProduct });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }

    // CRUD: Eliminar
    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            await ProductService.delete(pid);
            res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ status: 'error', error: error.message });
        }
    }
}

export default new ProductController();