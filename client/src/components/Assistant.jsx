import { useState } from "react";

const Assistant = () => {
  // Init the default prompt as empty
  const [prompt, setPrompt] = useState("");
  // Init the default uppgiftsbeskrivning as empty
  const [description, setDescription] = useState("");
  // Init the default response results as object
  const [results, setResults] = useState({});
  // Init the default assignment text as empty
  const [assignment, setAssignment] = useState("");

  return (
    <div className="assistant-container">
      <h1>Bajsa på dig</h1>
      {/* Input for the prompt */}
      <textarea
        placeholder="Vad kan jag hjälpa dig med?"
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
      ></textarea>

      {/* Input for uppgiftsbeskrivning */}
      <textarea
        placeholder="Uppgiftsbeskrivning?"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      ></textarea>

      {/* Input for the assignment */}
      <textarea
        placeholder="Klistra in uppgiften som ska bedömas"
        value={assignment}
        onChange={(event) => setAssignment(event.target.value)}
      ></textarea>
    </div>
  );
};

export default Assistant;
