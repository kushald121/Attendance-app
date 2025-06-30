import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req,file, cb){
        //cb = callback function
        cb(null, "./public/images");
    },

//How to name the file
filename: function (req,file,cb) {
let fileExtension = "";
if(file.originalname.split(".").length>1) {
    fileExtension = file.originalname.substring(
        file.originalname.lastIndexOf(".")
    );
}

const filenameWithoutExtension = file.originalname
.toLowerCase()
.split(" ")
.join("-")
?.split(".")[0];


cb(null, filenameWithoutExtension + Date.now() + Math.ceil(Math.random()*1e5) + fileExtension);

},
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 1*1000*1000,
    },
});