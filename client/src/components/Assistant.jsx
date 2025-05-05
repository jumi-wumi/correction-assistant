import { useState } from "react";
import ReactMarkdown from "react-markdown";

import GptResults from "./GptResults";

const Assistant = () => {
  // Init the default prompt as empty
  const [prompt, setPrompt] = useState("");
  // Init the default uppgiftsbeskrivning as empty
  const [description, setDescription] = useState("");
  // Init the default response results as object
  const [results, setResults] = useState({});
  // Init the default assignment text as empty
  const [assignment, setAssignment] = useState("");
  // Init state for active request to API
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Set active loading when request to is sent
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          description,
          assignment,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      // End loading to enable button press for new request
      setLoading(false);
    }
  };

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

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "..." : "Rätta"}
      </button>

      {loading && <p>Rättar inlämning...</p>}

      {/* Results from the GPT model  */}
      {results.output && (
        <div>
          <GptResults response={results.output[0]?.content[0]?.text} />
        </div>
      )}
    </div>
  );
};

export default Assistant;
