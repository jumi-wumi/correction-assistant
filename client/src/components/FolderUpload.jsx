import { useState } from "react";

const FolderUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [notionUrl, setNotionUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState({});
  const [isAssessing, setIsAssessing] = useState(false);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    console.log("Files selected:", selectedFiles.map(f => f.name));
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Please select files first");
      return;
    }

    const formData = new FormData();

    // append files to formdata
    files.forEach((file, index) => {
      formData.append("files", file);
      console.log(`Appending file ${index}: ${file.name}`);
    });

    try {
      const response = await fetch("http://localhost:3000/upload-from-folder", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("failed to upload files");

      const data = await response.json();
      setUploadedFiles(data.files);
      console.log("Files uploaded:", data.files);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    }
  };

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
    formData.append("prompt", "Kontrollera endast om alla G-nivå frågor är besvarade.");
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
      data.results.forEach(result => {
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={handleFileChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <button 
          onClick={handleUpload}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload Files
        </button>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Filename</th>
                <th 
                  onClick={() => setShowModal(true)}
                  className="border border-gray-300 p-2 text-left cursor-pointer hover:bg-gray-200"
                >
                  Kontrollera: är alla frågor bajsade?
                </th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">
                    <button 
                      onClick={() => setSelectedFileUrl(file.url)}
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      {file.filename}
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">
                    {assessmentResults[file.filename] ?? "Ej bedömd"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedFileUrl && (
            <div className="mt-4 w-full h-96 border border-gray-300 rounded">
              <iframe
                src={`http://localhost:3000${selectedFileUrl}`}
                className="w-full h-full border-none rounded"
                title="PDF Viewer"
              />
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Länk till uppgiftsbeskrivningen (Notion):
            </h3>
            <input
              type="text"
              placeholder="https://www.notion.so..."
              value={notionUrl}
              onChange={(event) => setNotionUrl(event.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAssessment}
                disabled={isAssessing}
                className={`px-4 py-2 rounded text-white ${
                  isAssessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isAssessing ? 'Bearbetar...' : 'Kör'}
              </button>
              <button 
                onClick={() => setShowModal(false)}
                disabled={isAssessing}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
              >
                Stäng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FolderUpload;