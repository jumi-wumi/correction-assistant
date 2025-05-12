import express from "express"; 
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY
}); 

router.post("/", async(request, response) => {
    const { prompt, description, assignment} = request.body;

    try{
        const modelResponse = await openai.responses.create({
            model: "gpt-4.1-nano",
            input: `Du är en lärarsassistent. Här är uppgiftsbeskrivningen: "${description}". 
            Här är elevens inlämning: "${assignment}"
            Bedöm detta baserat på: "${prompt}".`
        });

        response.json(modelResponse)
    } catch(error) {
        console.error(error)
    };
})

export default router;