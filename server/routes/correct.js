import express from "express"; 
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

import getTextFromNotion from "./extract-notion.js"

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
}); 

router.post("/", async(request, response) => {
    const { prompt, description, assignment} = request.body;

    try{
        const modelResponse = await openai.responses.create({
            model: "chatgpt-4o-latest",
            input: `Du är en lärarsassistent. Här är uppgiftsbeskrivningen: "${description}". 
            Här är elevens inlämning: "${assignment}"
            Bedöm detta baserat på: "${prompt}".`
        });

        response.json(modelResponse)
    } catch(error) {
        console.error(error)
    };
});

router.post("/notion-text", async(request, response) => {
    const {url} = request.body; 

    try {
        const text = await getTextFromNotion(url); 
        response.json({ success: true, text});
    } catch (error) {
        console.error("failed to fetch or parse Notion page", error);
        response.status(500).json({ success: false, error: error.message }); 
    }
});

export default router;