import express from "express";
import cors from "cors"; 
import dotenv from "dotenv"

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
