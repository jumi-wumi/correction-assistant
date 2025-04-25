import express from "express";

const app = express(); 

app.listen(3030, () => {
    console.log("Server started on port 3030")
});

// Test route
app.get("/", (request, response) => {
    response.send("Hiiiiiii bestie! <3");
});
