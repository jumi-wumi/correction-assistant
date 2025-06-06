import React from "react";

const AssessmentModal = ({
  files,
  notionUrl,
  setNotionUrl,
  setAssessmentResults,
  setIsAssessing,
  isAssessing,
  setShowModal,
}) => {
  const handleAssessment = async () => {
    if (!files || files.length === 0) {
      alert("Please select files first");
      return;
    }

    setIsAssessing(true);
    console.log("Starting assessment...");

    const formData = new FormData();

    // Add files to form data - use the original files, not uploadedFiles
    files.forEach((file, index) => {
      formData.append("files", file);
      console.log(`Added file ${index}: ${file.name}`);
    });

    // Add assessment parameters
    if (notionUrl) {
      formData.append("notionUrl", notionUrl);
      console.log("Added Notion URL:", notionUrl);
    }

    try {
      console.log("Sending request to /assess-folder");
      const response = await fetch("http://localhost:3000/assess-folder", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Assessment failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("Assessment data received:", data);

      // Update assessment results using the original file names
      const newResults = {};
      data.results.forEach((result) => {
        newResults[result.filename] = result.assessment;
      });

      setAssessmentResults(newResults);
      setShowModal(false);
    } catch (error) {
      console.error("Assessment error:", error);
      alert("Assessment failed: " + error.message);
    } finally {
      setIsAssessing(false);
    }
  };
  return (
    <div className="assessment-modal-container">
            <h3>
              Länk till uppgiftsbeskrivningen (Notion):
            </h3>
            <input
              type="text"
              placeholder="https://www.notion.so..."
              value={notionUrl}
              onChange={(event) => setNotionUrl(event.target.value)}
            />
            <div className="assessment-btn-container">
              <button
                onClick={handleAssessment}
                disabled={isAssessing}
              >
                {isAssessing ? "Bearbetar..." : "Kör"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                disabled={isAssessing}
              >
                Stäng
              </button>
            </div>
          </div>
  );
};

export default AssessmentModal;
