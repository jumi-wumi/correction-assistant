import express from "express";
import cors from "cors"; 
import dotenv from "dotenv"
import OpenAI from "openai";

const app = express(); 

dotenv.config(); 

app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
});

// Test route
app.get("/", (request, response) => {
    response.send("Hiiiiiii bestie! <3");
});

// Init OpenAi client with our key
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});

// OpenAI test
app.get("/test", async(request, response) => {
    console.log("request received on /test")

    try{
        const modelResponse = await openai.responses.create({
            model: "gpt-4.1",
            input: "Ge mig ett coolt djur-fakta"
        }); 

        response.json(modelResponse)
    } catch(error) {
        console.error(error); 
    }
});