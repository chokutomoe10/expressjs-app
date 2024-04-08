const multer = require('multer');
const path = require('path');

const upload = (image) => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
          cb(null, "image" + '-' + Date.now() +path.extname(file.originalname));
        }
    });

    
    return (req, res, next) => {
        const uploadImage = multer({
            storage: storage,
            fileFilter: (req, file, cb) => {
                if (file.mimetype == "image/png" || file.mimetype == "image/jpeg") {
                    cb(null, true);
                } else {
                    cb(null, false);
                    return res.status(400).json({
                        status: 102,
                        message: 'Format Image tidak sesuai',
                        data: null
                    })
                }
            }
        });

        uploadImage.single(image)(req, res, next)
    }
}

module.exports = upload;