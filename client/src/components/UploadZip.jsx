import React from "react";
import { useState } from "react";

const UploadZip = () => {
  // hold the zip file
  const [file, setFile] = useState(null);
  // hold parsed data of submissions
  const [studentFile, setStudentFile] = [];

  const handleUpload = async () => {
    // send formData key-value as body
    const formData = new FormData();
    formData.append("zip", file);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to upload");

    const data = await response.json();
    setStudentFile(data.files);
  };

  return (
    <>
      <input
        type="file"
        accept=".zip"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button onClick={handleUpload}>Ladda upp inlämningar</button>
        {studentFile.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Filnamn</th>
              <th>Innehåll</th>
            </tr>
          </thead>
          <tbody>
            {studentFile.map((file, i) => (
              <tr key={i}>
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

export default UploadZip;
