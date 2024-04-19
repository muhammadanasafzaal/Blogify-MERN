import multer from 'multer';

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) =>{ 
        cb(null, file.fieldname +  "_" + Date.now() + "_" + file.originalname)
    }
})

let fileFilter = (req, file, cb) => {
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png" ){
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

export default upload