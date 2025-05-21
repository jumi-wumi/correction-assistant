import express, { response } from "express"; 
import multer from "multer";
import fs from "fs/promises"

const router = express.Router(); 
const upload = multer({ dest: "uploads/" }); 

router.post("/upload-from-folder", upload.array("files"), async (request, response) => {
    try {
        const upla
    }
} )