import Users from "../dao/mongo/users.mongo.js";
import MailingService from "../services/mailing.js";

const userService = new Users();
const mailingService = new MailingService();

export const rolePremium = async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await userService.getUserById(uid);
        const documents = user.documents;
        const documentsUpload = documents.some(doc => doc.reference === 'documents');
        if (user.rol === "premium") {
            const premium = false;
            user.rol = "user"
            user.save();
            res.render("current", {user: user, premium});
        } else {
            if (documentsUpload) {
                const premium = true;
                user.rol = "premium"
                user.save();
                res.render("current", {user: user, premium});
            } else {
                const noDocuments = true;
                res.render("current", {user: user, noDocuments});
            }
        }
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};

export const documents = async (req, res) => {
    const { uid } = req.params;
    try {
        const user = await userService.getUserById(uid);
        if (!user) {
            return res.status(404).send({message: 'Usuario no encontrado'});
        }
        const profile_image = req.files.profile_image;
        const product_image = req.files.product_image;
        const documents = req.files.documents;
        if (product_image) {
            profile_image.forEach(file => {
                user.documents.push({
                    name: file.originalname,
                    reference: file.fieldname
                });
            });
        }
        if (product_image) {
            product_image.forEach(file => {
                user.documents.push({
                    name: file.originalname,
                    reference: file.fieldname
                });
            });
        }
        if (documents) {
            documents.forEach(file => {
                user.documents.push({
                    name: file.originalname,
                    reference: file.fieldname
                });
            });
        }
        await user.save();
        res.send({message: 'Documentos subidos correctamente'});
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        const result = users.map(user => ({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            rol: user.rol
        }));
        res.send(result);
    } catch (error) {
        req.logger.error(error);
        res.status(404).send({error});
    }
};

export const deleteExpiredUser = async (req, res) => {
    try {
        const now = new Date();
        const limit = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));
        const users = await userService.getUsers();
        const inactivityUsers = users.filter(user => new Date(user.last_connection) < limit);
        const sendMail = async (user) => {
            await mailingService.sendSimpleMail({
                from: "NodeMailer Contant",
                to: user.email,
                subject: "Cuenta eliminada por inactividad",
                html: `
                    <h1>Hola ${user.first_name}!!</h1>
                    <p>Su cuenta ha sido eliminada por inactividad, no debes pasar más de 2 dias sin entrar !!!</p>
                `
            });
        }
        inactivityUsers.forEach(user => sendMail(user));
        const userIds = inactivityUsers.map(user => user._id);
        await userService.deleteUsers(userIds);
        res.send({message: "Usuarios inactivos eliminados correctamente"});
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};

export const roles = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(id);
        let newRol;
        if (user.rol === 'admin') {
            user.rol = 'premium';
        } else if (user.rol === 'premium') {
            user.rol = 'user';
        } else if (user.rol === 'user') {
            user.rol = 'admin'
        }
        await user.save();
        const users = await userService.getUsers();
        res.render('admin', {users});
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await userService.deleteUserById(id);
        res.send({message: 'Usuario eliminado correctamente'});
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};