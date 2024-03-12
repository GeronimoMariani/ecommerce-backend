import { createHash } from "../../utils/bcrypt";

export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name,
        this.last_name = user.last_name,
        this.email = user.email
        this.password = createHash(user.password),
        this.age = user.age,
        this.rol = user.rol
    }
}
