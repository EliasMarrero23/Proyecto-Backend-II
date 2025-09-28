// src/repositories/TicketRepository.js
import TicketDAO from '../dao/TicketDAO.js';

class TicketRepository {
    async createTicket(data) {
        return await TicketDAO.create(data);
    }
    
    async getTicketByCode(code) {
        return await TicketDAO.getByCode(code);
    }
}
export default TicketRepository;