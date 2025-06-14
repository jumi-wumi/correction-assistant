import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import getTextFromNotion from "./extract-notion.js";
import { pdf2string } from "afpp";

dotenv.config();

const router = express.Router();

// init OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// Modified route that works with already uploaded files
router.post("/assess-folder", async (request, response) => {
  const { notionUrl, uploadedFiles } = request.body;
  
  console.log("Assessment request received");
  console.log("Number of files to assess:", uploadedFiles?.length || 0);
  console.log("Notion URL:", notionUrl);

  try {
    const results = [];
    let notionText = "";

    // Validate files exist
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return response.status(400).json({ error: "No uploaded files provided" });
    }

    // extract notion text
    if (notionUrl) {
      try {
        console.log("Extracting Notion text...");
        notionText = await getTextFromNotion(notionUrl);
        console.log("Notion text extracted, length:", notionText.length);
      } catch (error) {
        console.error("Failed to get Notion text:", error);
      }
    }

    // Process each uploaded file
    for (let i = 0; i < uploadedFiles.length; i++) {
      const fileInfo = uploadedFiles[i];
      console.log(`Processing file ${i + 1}/${uploadedFiles.length}: ${fileInfo.filename}`);
      
      // Construct the full file path from the uploaded file info
      const filePath = path.join('uploads', fileInfo.savedAs || path.basename(fileInfo.url));
      console.log(`Looking for file at: ${filePath}`);

      try {
        let extractedText = "";

        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.error(`File not found: ${filePath}`);
          results.push({
            filename: fileInfo.filename,
            assessment: "Error: File not found on server"
          });
          continue;
        }

        // Get file stats
        const stats = fs.statSync(filePath);
        console.log(`File stats - size: ${stats.size}, is file: ${stats.isFile()}`);

        // Check if file is PDF
        const isPdf = path.extname(fileInfo.filename).toLowerCase() === ".pdf";

        if (isPdf) {
          try {
            console.log(`Attempting PDF extraction for: ${fileInfo.filename}`);
            
            const buffer = fs.readFileSync(filePath);
            console.log(`Buffer size: ${buffer.length} bytes`);

            if (buffer.length === 0) {
              throw new Error("Empty file buffer");
            }

            // Try PDF extraction with timeout
            const extractionPromise = pdf2string(buffer);
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("PDF extraction timeout")), 30000)
            );

            const textPages = await Promise.race([extractionPromise, timeoutPromise]);
            
            if (!textPages || textPages.length === 0) {
              throw new Error("No text extracted from PDF");
            }

            // Join pages into one string
            extractedText = textPages.join("\n\n--- Page Break ---\n\n");
            console.log(`Extracted text length: ${extractedText.length} characters`);

            // Log first 500 characters for debugging
            console.log(`First 500 chars: ${extractedText.substring(0, 500)}...`);

            // Check for mostly empty content (only page breaks)
            const meaningfulText = extractedText.replace(/--- Page Break ---/g, '').trim();
            if (meaningfulText.length < 50) {
              console.warn(`PDF appears to contain mostly empty pages: ${fileInfo.filename}`);
              extractedText = "PDF appears to contain mostly empty pages or unreadable text";
            }

          } catch (pdfError) {
            console.error(`PDF extraction error for ${fileInfo.filename}:`, pdfError);
            extractedText = `Failed to extract text from PDF: ${pdfError.message}`;
          }
        } else {
          // Handle non-PDF files
          console.log(`Non-PDF file detected: ${fileInfo.filename}`);
          try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            extractedText = fileContent;
            console.log(`Text file extracted, length: ${extractedText.length}`);
          } catch (textError) {
            console.error(`Text extraction error for ${fileInfo.filename}:`, textError);
            extractedText = `Failed to extract text: ${textError.message}`;
          }
        }

        // Assessment logic
        try {
          // Skip assessment if text extraction failed
          if (extractedText.startsWith("Failed to extract") || 
              extractedText.startsWith("Error:") ||
              extractedText.includes("mostly empty pages")) {
            results.push({
              filename: fileInfo.filename,
              assessment: `Kunde inte läsa filen: ${extractedText}`
            });
            continue;
          }

          // Check if extracted text is meaningful
          if (!extractedText || extractedText.trim().length < 10) {
            results.push({
              filename: fileInfo.filename,
              assessment: "Kunde inte extrahera tillräckligt med text från filen"
            });
            continue;
          }

          const fixedPrompt = `Kontrollera endast om alla G-nivå frågor är besvarade. Detta är uppgiftsbeskrivningen: "${
            notionText || "Ingen uppgiftsbeskrivning tillgänglig"
          }". 
          Här är elevens inlämning: "${extractedText.substring(0, 8000)}", Fil: ${fileInfo.filename}. `;

          console.log(`Sending to OpenAI for assessment: ${fileInfo.filename}`);

          const responseData = await openai.responses.create({
            model: "gpt-4.1-nano",
            input: fixedPrompt,
          });

          const assessment = responseData.output?.[0]?.content?.[0]?.text || "Kunde inte få bedömning från AI";

          results.push({
            filename: fileInfo.filename,
            assessment,
          });

          console.log(`Assessment completed for: ${fileInfo.filename}`);

        } catch (assessmentError) {
          console.error(`Assessment error for ${fileInfo.filename}:`, assessmentError);
          results.push({
            filename: fileInfo.filename,
            assessment: `Bedömning misslyckades: ${assessmentError.message}`
          });
        }

      } catch (fileError) {
        console.error(`File processing error for ${fileInfo.filename}:`, fileError);
        results.push({
          filename: fileInfo.filename,
          assessment: `File processing failed: ${fileError.message}`
        });
      }
    }

    console.log(`Assessment complete. Returning ${results.length} results`);
    response.json({ results });

  } catch (error) {
    console.error("Assessment route error:", error);
    response.status(500).json({
      error: `Assessment failed: ${error.message}`,
      details: error.stack
    });
  }
});

export default router;