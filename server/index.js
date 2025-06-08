import express from "express";
import cors from "cors"; 
import dotenv from "dotenv"
import uploadRoute from "./routes/upload-unzipped.js"
import assessRoute from "./routes/assess-folder.js"

// Debug: Log when routes are imported
console.log("Upload route imported:", typeof uploadRoute);
console.log("Assess route imported:", typeof assessRoute);

const app = express(); 

dotenv.config(); 

app.use(express.json());

// CORS
const corsOptions = {
    // Vite's standard port 
    origin:["http://localhost:5173"]
}

// Pass options to only accept from the Vite origin for now
app.use(cors(corsOptions));

// serve static files
app.use('/uploads', express.static('uploads', {
  setHeaders: (response, path) => {
    if (path.endsWith('.pdf')) {
      // Tell browser to display inline (not download)
      response.setHeader('Content-Disposition', 'inline');
      response.setHeader('Content-Type', 'application/pdf');
    }
  }
}));

// Routes
app.use("/", uploadRoute);
app.use("/", assessRoute);


app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`)
});

app.get("/", (request, response) => {
    response.json("API fetch works")
})


//----------TEST SECTION! UNCOMMENT TO TEST ROUTE AND/OR API----------
// // Test route
// app.get("/", (request, response) => {
//     response.send("Hiiiiiii bestie! <3");
// });

// // Init OpenAi client with our key
// const openai = new OpenAI({
//     apiKey: process.env.OPEN_AI_KEY,
// });

// // OpenAI test
// app.get("/test", async(request, response) => {
//     console.log("request received on /test")

//     try{
//         const modelResponse = await openai.responses.create({
//             model: "",
//             input: "Ge mig ett coolt djur-fakta"
//         }); 

//         response.json(modelResponse)
//     } catch(error) {
//         console.error(error); 
//     }
// });
//----------END TEST SECTION----------

