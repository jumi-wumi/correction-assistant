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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-2">
          Länk till uppgiftsbeskrivningen (Notion):
        </h3>
        <input
          type="text"
          placeholder="https://www.notion.so..."
          value={notionUrl}
          onChange={(event) => setNotionUrl(event.target.value)}
          className="w-full border border-brown/20 p-2 rounded-md text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={handleAssessment}
            disabled={isAssessing}
            className="bg-blue text-white px-4 py-2 rounded-md hover:bg-blue/90 transition disabled:opacity-50 cursor-pointer"
          >
            {isAssessing ? "Bearbetar..." : "Kör"}
          </button>
          <button
            onClick={() => setShowModal(false)}
            disabled={isAssessing}
            className="text-brown border border-brown/30 px-4 py-2 rounded-md hover:bg-brown/10 disabled:opacity-50 cursor-pointer"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;
