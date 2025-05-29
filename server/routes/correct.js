import express from "express";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

import getTextFromNotion from "./extract-notion.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

router.post("/correct", async (request, response) => {
  const { description, assignment } = request.body;

  try {
    const modelResponse = await openai.responses.create({
      model: "gpt-3.5-turbo",
      // maybe change - default if no input || input from UI
      input: prompt || `Kontrollera endast om alla G-nivå frågor är besvarade. Ge output i formatet: om alla frågor är besvarade ✅. Om inte: [antal frågor besvarade]/[antal totala frågor]. Detta är uppgiftsbeskrivningen: "${description}". 
            Här är elevens inlämning: "${assignment}"
       `,
    });

    // Instruktioner för bedömning:
    // - Kontrollera att alla frågor i uppgiften är besvarade.
    // - Flagga för eventuella faktamässiga fel.
    // - Kontrollera aldrig stavning eller grammatik

    // VIKTIGT: Ge alltid svaret i följande format exakt:

    // Alla frågor besvarade: [Ja eller Nej]

    // Brister, varningar:
    // [Lista eventuella brister eller varningar här, eller skriv "Inga brister" om inga finns]

    // Förslag på kommentar från läraren:
    // [Skriv en kort och konstruktiv kommentar som läraren kan använda]

    // Bedöm baserat på ovanstående.

    response.json(modelResponse);
  } catch (error) {
    console.error(error);
  }
});

router.post("/notion-text", async (request, response) => {
  const { url } = request.body;

  try {
    const text = await getTextFromNotion(url);
    response.json({ success: true, text });
  } catch (error) {
    console.error("failed to fetch or parse Notion page", error);
    response.status(500).json({ success: false, error: error.message });
  }
});

export default router;
