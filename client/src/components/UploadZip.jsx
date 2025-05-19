import React from "react";
import { useState } from "react";

const UploadZip = () => {
  const [studentFile, setStudentFile] = useState(null);

  const handleUpload = async () => {
    // send formData key-value as body
    const formData = new FormData();
    formData.append("zip", studentFile);

    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setStudentFile(data); 
  };

  return (
    <>
      <input
        type="file"
        accept=".zip"
        onChange={(event) => FileSystemFileEntry(event.target.files[0])}
      />
      <button onClick={handleUpload}>Ladda upp inlämningar</button>
    </>
  );
};

export default UploadZip;
