import React from "react";

const FileList = ({
  uploadedFiles,
  assessmentResults,
  setShowModal,
  setSelectedFileUrl,
  selectedFileUrl,
}) => {
  return (
    <div className="bg-darkest p-6 rounded-xl border-t border-b shadow-xl border-purple">
      {uploadedFiles.length > 0 && (
        <div>
          <div className="flex justify-between p-4">
            <h2 className="text-xl font-semibold text-medium">
              Uppladdade filer
            </h2>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm bg-dark text-darkest px-4 py-2 rounded-lg hover:bg-purple cursor-pointer"
            >
              Kontrollera alla filer
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-darkest text-white text-sm border-b-2 border-purple">
                <th className="px-4 py-3">Filnamn</th>
                <th className="px-4 py-3">Kontroll</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark">
              {uploadedFiles.map((file, idx) => {
                const isSelected = selectedFileUrl === file.url;
                return (
                  <>
                    <tr key={`row-${idx}`}>
                      <td className="px-4 py-3">
                        <button
                          onClick={() =>
                            setSelectedFileUrl(isSelected ? null : file.url)
                          }
                          className="text-medium hover:underline"
                        >
                          {file.filename}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-medium">
                        {assessmentResults[file.filename] ?? "Ej bedömd"}
                      </td>
                    </tr>
                    {isSelected && (
                      <tr key={`iframe-${idx}`}>
                        <td colSpan={2}>
                          0f7b6cpurple
                          <div className="w-full h-96 border rounded my-2 border-purple">
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
