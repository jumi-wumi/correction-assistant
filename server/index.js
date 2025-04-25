import express from "express";
import cors from "cors"; 

const app = express(); 

app.use(cors());

app.listen(3030, () => {
    console.log("Server started on port 3030")
});

// Test route
app.get("/", (request, response) => {
    response.send("Hiiiiiii bestie! <3");
});
