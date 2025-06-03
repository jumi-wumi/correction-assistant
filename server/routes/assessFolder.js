import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import dotenv from "dotenv";
import OpenAI from "openai";
import getTextFromNotion from "./extract-notion.js";
import { pdf2string } from "afpp";

dotenv.config();

const router = express.Router();
const upload = multer({ dest: "../uploads/" });

// init OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

router.post(
  "/assess-folder",
  upload.array("files"),
  async (request, response) => {
    const { notionUrl } = request.body;

    try {
      const results = [];
      let notionText = "";

      // extract notion text
      if (notionUrl) {
        try {
          notionText = await getTextFromNotion(notionUrl);
        } catch (error) {
          console.error("failed to get Notion text", error);
        }
      }

      const extractedFiles = [];

      // extracting text from files first
      console.log("extracting text from files...");
      for (const file of request.files) {
        try {
          let extractedText = "";

          // check if file is pdf
          if (
            file.mimetype === "application/pdf" ||
            path.extname(file.originalname).toLowerCase() === ".pdf"
          ) {
            try {
              // read file buffer
              const buffer = fs.readFileSync(file.path);

              const textPages = await pdf2string(buffer);

              // join pages into one string
              extractedText = textPages.join("\n\n--- Page Break ---\n\n");

              console.log(extractedText);
            } catch (error) {
              console.error("PDF extraction error:", error);
              extractedText = "Failed to extract text from PDF";
            }
          }

          extractedFiles.push({ file, extractedText });
        } catch (pdfError) {
          console.error("PDF extraction error:", pdfError);
          extractedFiles.push({
            file,
            extractedText:
              "Failed to extract text from PDF: " + pdfError.message,
          });
        }
      }

      console.log("text extraction complete for all files");

      // go through and process each file
      for (const { file, extractedText } of extractedFiles) {
        const fixedPrompt = `Kontrollera endast om alla G-nivå frågor är besvarade. Ge output i formatet: om alla frågor är besvarade ✅. Om inte: [antal frågor besvarade]/[antal totala frågor]. Detta är uppgiftsbeskrivningen: "${
          notionText || "Ingen uppgiftsbeskrivning tillgänglig"
        }". 
            Här är elevens inlämning: "${extractedText}", Fil: ${
          file.originalname
        }. `;

        // // upload to openAI
        // const fileStream = fs.createReadStream(file.path);
        // const uploadedFile = await openai.files.create({
        //   file: fileStream,
        //   purpose: "assistants",
        // });

        // // sned to responses api
        // const responseData = await openai.responses.create({
        //   model: "gpt-4.1-nano",
        //   input: fixedPrompt,
        // });

        // const assessment = responseData.output?.[0]?.content?.[0]?.text;

        results.push({
          filename: file.originalname,
          fileId: null,
          assessment: "skip api call",
        });
      }

      // clean up files
      console.log("Cleaning up files");
      if (request.files) {
        request.files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      response.json({ results });
    } catch (error) {
      console.log(error);

      // clean up files
      console.log("Cleaning up files");
      if (request.files) {
        request.files.forEach((file) => {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
      }

      response.status(500).json({
        error: error.message,
      });
    }
  }
);

export default router;
