import Users from "../dao/mongo/users.mongo.js";

const userService = new Users();

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