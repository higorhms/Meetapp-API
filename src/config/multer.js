import path from 'path';
import multer from 'multer';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'temp', 'uploads'),
        filename: (req, file, callback) => {
            crypto.randomBytes(16, (err, res) => {
                if (err) {
                    return callback(err);
                }

                return callback(
                    null,
                    res.toString('hex') + path.extname(file.originalname)
                );
            });
        },
    }),
};
