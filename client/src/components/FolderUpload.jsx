import { use, useState } from "react";

const FolderUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

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
        onChange={(e) => setFiles(e.target.files)}
      />

      <button onClick={handleUpload}>Upload Files</button>

      {uploadedFiles.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Filename</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file, idx) => (
              <tr key={idx}>
                <td>{file.filename}</td>
                <td>
                  <pre>{file.content}</pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default FolderUpload;
