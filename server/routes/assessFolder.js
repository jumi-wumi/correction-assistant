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
    const { prompt, notionUrl } = request.body;

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

      // go through and process each file
      for (const file of request.files) {
        try {
          let extractedText = "";

          // check if file is pdf
          if (
            file.mimetype === "application/pdf" ||
            path.extname(file.originalname).toLowerCase() === ".pdf"
          ) {
            console.log("Processing as PDF...");

            try {
              // read file buffer
              const buffer = fs.readFileSync(file.path);

              const textPages = await pdf2string(buffer);

              // join pages into one string
              extractedText = textPages.join("\n\n--- Page Break ---\n\n");
            } catch (error) {
              console.error("PDF extraction error:", pdfError);
              extractedText = "Failed to extract text from PDF";
            }
          }

          console.log("Preparing API call...");

          // upload to openAI
          const fileStream = fs.createReadStream(file.path);
          const uploadedFile = await openai.files.create({
            file: fileStream,
            purpose: "assistants",
          });

          const fileId = uploadedFile.id;

          //the input for the api
          const inputText = `${
            prompt || "Kontrollera endast om alla G-nivå frågor är besvarade."
          }${
            notionText ? `\n\nAssignment Description:\n${notionText}` : ""
          }\n\nFile: ${file.originalname}\n\nContent:\n${extractedText}`;

          // sned to responses api
          const responseData = await openai.responses.create({
            model: "gpt-4.1-nano",
            input: inputText,
          });

          const assessment = responseData.output?.[0]?.content?.[0]?.text;

          results.push({
            filename: file.originalname,
            fileId: null,
            assessment: assessment,
          });
        } catch (error) {
          console.error(error);
          results.push({
            filename: file.originalname,
            fileId: null,
            assessment: "error vid bedömning",
          });
        }
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
