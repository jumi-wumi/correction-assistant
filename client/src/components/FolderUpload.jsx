import { useState } from "react";

const FolderUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  const [notionUrl, setNotionUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState({});

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    // append files to formdata
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const response = await fetch("http://localhost:3000/upload-from-folder", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("failed to upload files");

    const data = await response.json();
    setUploadedFiles(data.files);
  };

  return (
    <>
      <input
        type="file"
        // OBS! Only handle folder uploads in Chromium based browsers
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFileChange}
      />

      <button onClick={handleUpload}>Upload Files</button>

      {uploadedFiles.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th
                  onClick={() => setShowModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  Alla frågor besvarade?
                </th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, idx) => (
                <tr key={idx}>
                  <td>
                    <button onClick={() => setSelectedFileUrl(file.url)}>
                      {file.filename}
                    </button>
                  </td>
                  <td>{assessmentResults[file.filename] ?? "Ej bedömd"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedFileUrl && (
            <div style={{ width: "100%", height: "80vh", marginTop: "1rem" }}>
              <iframe
                src={`http://localhost:3000${selectedFileUrl}`}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="PDF Viewer"
              />
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-container">
          <div className="modal">
            <h3>Länk till uppgiftsbeskrivningen (Notion):</h3>
            <input
              type="text"
              placeholder="https://www.notion.so..."
              value={notionUrl}
              onChange={(event) => setNotionUrl(event.target.value)}
            />
            <button
              onClick={async () => {
                await assessAllFiles();
                setShowModal(false);
              }}
            >
              Kör
            </button>
            <button onClick={() => setShowModal(false)}>Stahp</button>
          </div>
        </div>
      )}
    </>
  );
};

export default FolderUpload;
