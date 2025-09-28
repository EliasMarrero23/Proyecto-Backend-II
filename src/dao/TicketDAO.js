// src/dao/TicketDAO.js
import Ticket from '../models/Ticket.js';

class TicketDAO {
    async create(ticketData) {
        return await Ticket.create(ticketData);
    }
    
    async getByCode(code) {
        return await Ticket.findOne({ code }).lean();
    }
}
export default new TicketDAO();