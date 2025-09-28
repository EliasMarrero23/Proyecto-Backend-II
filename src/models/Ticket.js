// src/models/Ticket.js
import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    // Código único generado en el PurchaseService (ej. usando crypto)
    code: { 
        type: String, 
        unique: true, 
        required: true 
    },
    // Fecha y hora de la compra
    purchase_datetime: { 
        type: Date, 
        default: Date.now 
    },
    // Monto total de la compra
    amount: { 
        type: Number, 
        required: true 
    },
    // Email del comprador (se obtiene de req.user.email)
    purchaser: { 
        type: String, 
        required: true 
    },
    // Lista de productos que realmente se compraron
    products: [{ 
        product: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Products', 
            required: true 
        },
        quantity: { 
            type: Number, 
            required: true 
        }
    }]
});

const Ticket = mongoose.model('Tickets', ticketSchema);
export default Ticket;