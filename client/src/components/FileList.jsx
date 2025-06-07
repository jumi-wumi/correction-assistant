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
          <div className="table-header-container">
            <h2>Uppladdade files</h2>
            <button onClick={() => setShowModal(true)}>
              Kontrollera alla filer
            </button>
          </div>

          <table className="main-table">
            <thead>
              <tr className="file-name-row">
                <th>Filnamn</th>
                <th>Kontroll</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, idx) => {
                const isSelected = selectedFileUrl === file.url;
                return (
                  <>
                    <tr key={`row-${idx}`}>
                      <td className="files-data">
                        <button
                          onClick={() =>
                            setSelectedFileUrl(isSelected ? null : file.url)
                          }
                        >
                          {file.filename}
                        </button>
                      </td>
                      <td className="asses-data">
                        {assessmentResults[file.filename] ?? "Ej bedömd"}
                      </td>
                    </tr>
                    {isSelected && (
                      <tr key={`iframe-${idx}`}>
                        <td colSpan={2}>
                          <div className="w-full h-96 border rounded my-2">
                            <iframe
                              src={`http://localhost:3000${file.url}`}
                              className="w-full h-full border-none rounded"
                              title={`PDF: ${file.filename}`}
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileList;
