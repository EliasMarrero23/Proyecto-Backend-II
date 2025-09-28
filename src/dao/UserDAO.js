
import User from '../models/User.js';

class UserDAO {
    
    // Método requerido por UserRepository.getUserById (JWT)
    async getById(id) {
        return await User.findById(id);
    }
    
    // Método requerido por UserRepository.getUserByEmail (Login/Register)
    async getByEmail(email) {
        return await User.findOne({ email });
    }

    // Método requerido por UserRepository.createUser (Register)
    async create(userData) {
        return await User.create(userData);
    }

}

export default UserDAO;