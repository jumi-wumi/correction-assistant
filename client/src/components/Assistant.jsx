import { useState } from "react";

const Assistant = () => {
  // Init the default prompt as empty
  const [prompt, setPrompt] = useState("");
  // Init the default uppgiftsbeskrivning as empty
  const [description, setDescription] = useState("");
  // Init the default response results as object
  const [results, setResults] = useState({});

  return <div></div>;
};

export default Assistant;
