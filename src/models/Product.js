// src/models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, unique: true, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 }, // CLAVE para la lógica de compra
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    status: { type: Boolean, default: true }
});

const Product = mongoose.model('Products', productSchema);
export default Product;