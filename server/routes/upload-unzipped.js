import express from "express"; 
import multer from "multer";
import fs from "fs/promises"
import path from "path";

const router = express.Router(); 

const fileStorage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (request, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${file.originalname}${extension}`); 
  }
});

const upload = multer({ storage: fileStorage }); 


router.post("/upload-from-folder", upload.array("files"), async (request, response) => {
  try {
    const uploadedFiles = request.files.map((file) => {
      return {
        filename: file.originalname,
        url: `/uploads/${file.filename}`,
      };
    });

    response.json({ files: uploadedFiles });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "File processing failed" });
  }
});


export default router