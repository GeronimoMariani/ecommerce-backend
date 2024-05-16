import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadFolder = 'uploads/documents/'
        if (file.fieldname === 'profile_image') {
            uploadFolder = 'uploads/profiles/';
        } else if (file.fieldname === 'product_image') {
            uploadFolder = 'uploads/products/';
        }

        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + file.originalname;
        cb(null, fileName);
    }
});

export const uploader = multer({storage});