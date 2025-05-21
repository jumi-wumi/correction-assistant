import express from "express";
import multer from "multer";
import unzipper from "unzipper";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configure Multer to save uploaded files in /uploads
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("zip"), async (request, response) => {
  const zipPath = request.file.path;

  try {
    // Extract zip and get file contents
    const extractedFiles = await extractZip(zipPath);

    // Delete uploaded ZIP file after extraction
    fs.unlink(zipPath, () => {});

    // Respond with extracted content
    response.json({ files: extractedFiles });
    console.log("Extracted:", extractedFiles);
  } catch (err) {
    console.error("Zip extraction failed:", err);
    response.status(500).json({ error: "Failed to extract zip" });
  }
});

// Async helper to extract files
async function extractZip(zipPath) {
  const extractedFiles = [];
  const zipStream = fs.createReadStream(zipPath).pipe(unzipper.Parse());

  for await (const entry of zipStream) {
    const filename = entry.path;
    const type = entry.type;

    if (type === "File") {
      const chunks = [];
      for await (const chunk of entry) {
        chunks.push(chunk);
      }
      const content = Buffer.concat(chunks).toString("utf-8");
      extractedFiles.push({ filename, content });
    } else {
      entry.autodrain();
    }
  }

  return extractedFiles;
}

export default router;
