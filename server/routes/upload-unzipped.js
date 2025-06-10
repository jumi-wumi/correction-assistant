import express from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (request, file, cb) => {
    const timestamp = Date.now();
    // generates a random UUID
    const uuid = crypto.randomUUID();
    // get .pdf extension
    const extension = path.extname(file.originalname); 

    const safeFilename = `${timestamp}-${uuid}${extension}`;
    cb(null, safeFilename);
  },
});

const upload = multer({ storage: fileStorage });

router.post(
  "/upload-from-folder",
  upload.array("files"),
  async (request, response) => {
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
  }
);

export default router;
