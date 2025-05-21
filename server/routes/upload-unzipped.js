import express, { response } from "express"; 
import multer from "multer";
import fs from "fs/promises"

const router = express.Router(); 
const upload = multer({ dest: "uploads/" }); 

router.post("/upload-from-folder", upload.array("files"), async (req, res) => {
  try {
    // req.files is an array of uploaded files
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const content = await fs.readFile(file.path, "utf-8");
        // Delete the temp file
        await fs.unlink(file.path);
        return {
          filename: file.originalname,
          content,
        };
      })
    );

    res.json({ files: uploadedFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "File processing failed" });
  }
} )

export default router