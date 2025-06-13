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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-darkest border border-dark rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-lg font-semibold mb-4 text-white">
          Länk till uppgiftsbeskrivningen (Notion):
        </h3>
        <input
          type="text"
          placeholder="https://www.notion.so..."
          value={notionUrl}
          onChange={(event) => setNotionUrl(event.target.value)}
          disabled={isAssessing}
          className="w-full bg-dark border border-purple text-white placeholder-medium p-3 rounded-lg text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent disabled:opacity-50"
        />

        {isAssessing && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple border-t-transparent"></div>
              <span className="text-gray-300 text-sm">Bearbetar filer...</span>
            </div>
            <div className="mt-3 bg-medium rounded-full h-2">
              <div className="bg-purple h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-medium mt-2">Detta kan ta en stund. Du kan hämta kaffe!</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={handleAssessment}
            disabled={isAssessing}
            className="bg-purple text-white px-6 py-2 rounded-lg hover:bg-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAssessing && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple border-t-transparent"></div>
            )}
            <span>{isAssessing ? "Bearbetar..." : "Kör"}</span>
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="text-medium border border-dark px-6 py-2 rounded-lg hover:border-purple disabled:opacity-50 transition-colors"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentModal;
