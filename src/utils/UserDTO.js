// src/utils/UserDTO.js
class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.full_name = `${user.first_name} ${user.last_name}`;
        this.email = user.email;
        this.role = user.role;
        this.cartId = user.cart; // ID del carrito
        // Se omiten contraseñas y otros datos sensibles
    }
}
export default UserDTO;