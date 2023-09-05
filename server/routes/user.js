import express from 'express'
import { updateProfile, getUserProfile, getUsers } from '../controllers/user.js'
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, path.join(__dirname, "../../client/public/uploads"))
        cb(null, 'uploads')
    },
    filename: (req, file, cb) =>{
        cb(null, file.fieldname +  "_" + Date.now() + "_" + file.originalname)
    }
})

let fileFilter = (req, file, cb) => {
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png" ){
        cb(null, true);
    }
    else{
        cb(null, false)
    }
};

let upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const router = express.Router()
router.post('/profile/update', upload.array('images', 2), updateProfile)
router.get('/profile/:id', getUserProfile)
router.get('/', getUsers)

export default router;