import multer from "multer";
import path from "node:path";
import fs from "fs";

export const fileValidation = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/webp"],
  pdf: ["application/pdf"],
  video: ["video/mp4", "video/mkv", "video/avi"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  document: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

};


export const localFileUpload = ({customPath = "general", validation = []}) => {
    const basePath = `/uploads/${customPath}`
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {       // destination الكود يتحفظ فين ع السيرفر
        let userBasePath = basePath;
        if(req.user?.id) userBasePath += `/${req.user?.id}`;
        const fullPath = path.resolve(`./src/${userBasePath}`);
        if(!fs.existsSync(fullPath)) fs.mkdirSync(fullPath,{recursive:true});
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      const uniqueFileName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;
        file.finalPath = `${basePath}/${req.user.id}/${uniqueFileName}`;
      cb(null, uniqueFileName);
    },
  });

   const fileFilter = (req,file,cb)=>{
    if(validation.includes(file.mimetype)) cb(null,true);
    else cb(new Error("Invalid file type"),false);
   }
  return multer({ fileFilter, storage  });
};











