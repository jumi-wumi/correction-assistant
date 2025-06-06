import React from "react";

const FileList = ({
  uploadedFiles,
  assessmentResults,
  setShowModal,
  setSelectedFileUrl,
  selectedFileUrl,
}) => {
  return (
    <div className="file-list">
      {uploadedFiles.length > 0 && (
        <div className="table-container">
          <table className="main-table">
            <thead>
              <tr className="file-name-row">
                <th>Filename</th>
                <th onClick={() => setShowModal(true)}>
                  Kontrollera: är alla frågor bajsade?
                </th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, idx) => (
                <tr key={idx}>
                  <td className="files-data">
                    <button onClick={() => setSelectedFileUrl(file.url)}>
                      {file.filename}
                    </button>
                  </td>
                  <td className="asses-data">
                    {assessmentResults[file.filename] ?? "Ej bedömd"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedFileUrl && (
            <div className="pdf-viewer-container">
              <iframe
                src={`http://localhost:3000${selectedFileUrl}`}
                className="w-full h-full border-none rounded"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileList;
