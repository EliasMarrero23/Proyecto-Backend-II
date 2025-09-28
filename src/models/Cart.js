// src/models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products', // Debe hacer referencia al nuevo modelo 'Products'
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }]
});

// Este middleware es útil si quieres que 'products' se muestre completo al hacer .populate()
cartSchema.pre('findOne', function () {
    this.populate('products.product');
});

const Cart = mongoose.model('Carts', cartSchema);
export default Cart;