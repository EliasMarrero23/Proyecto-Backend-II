
import UserDAO from '../dao/UserDAO.js'; 
import UserDTO from '../utils/UserDTO.js';

class UserRepository {
    constructor() {
        this.dao = new UserDAO();
    }

    // 1. Método requerido por Passport (Login/Register) para verificar existencia
    async getUserByEmail(email) {
        const user = await this.dao.getByEmail(email);
        return user;
    }

    // 2. Método requerido por Passport (JWT/Deserialize) para buscar por ID
    async getUserById(id) { 
        const user = await this.dao.getById(id);
        return user;
    }

    // 3. Método requerido por Passport (Register) para crear el usuario
    async createUser(userData) {
        const newUser = await this.dao.create(userData);
        return newUser;
    }
    
}

export default UserRepository;