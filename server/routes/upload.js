import express from "express";
import multer from "multer";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";

const router = express.Router();

// config Multer to save files from users' upload to uploads/ folder
const upload = multer({ dest: "uploads/" });

// accept single zip file
router.post("/upload", upload.single("zip"), async (request, response) => {
  const zipPath = request.file.path;

  // store extracted file content in array
  const extractedFiles = [];

  fs.createReadStream(zipPath)
    // pipe streamed zip file into unzipper to parse
    .pipe(unzipper.Parse())
    .on("entry", async function (entry) {
      const filename = entry.path;
      const type = entry.type;

      if (type === "File") {
        let chunks = [];
        for await (const chunk of entry) {
          chunks.push(chunk);
        }   

        // combine chunks and convert to string
        const content = Buffer.concat(chunks).toString("utf-8");
        extractedFiles.push({ filename, content });
      } else {
        // inf not a file, e.g. directory, get rid of that shit
        entry.autodrain();
      }
    })
    // close stream when all entries are processed
    .on("close", () => {
    // delete uploaded zip file
      fs.unlink(zipPath, () => {});
      response.json({ files: extractedFiles });
    })
    .on("error", (err) => {
      response.status(500).json({ error: "Failed to extract zip" });
    });
});

export default router;
