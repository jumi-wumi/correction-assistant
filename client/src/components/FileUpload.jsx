import React from "react";

const FileUpload = ({ files, setFiles, setUploadedFiles }) => {
  // handle file selection from file input
  const handleFileChange = (event) => {
    // convert to array from the iterable list
    const selectedFiles = Array.from(event.target.files);
    // update the state for files
    setFiles(selectedFiles);
    // log the selected file names to check which are being added
    console.log(
      "Files selected:",
      selectedFiles.map((f) => f.name)
    );
  };
  // upload files to the server
  const handleUpload = async () => {
    if (!files || files.length === 0) {
      alert("Please select files first");
      return;
    }

    // create new formdata object
    // compile key/value pairs to send using fetch
    const formData = new FormData();

    // append files to formdata
    files.forEach((file, index) => {
      formData.append("files", file); // set the key to "files"
      console.log(`Appending file ${index}: ${file.name}`);
    });

    try {
      // send formdata to endpoint
      const response = await fetch("http://localhost:3000/upload-from-folder", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("failed to upload files");

      // parse the response
      const data = await response.json();
      // save uploaded file into to the state
      setUploadedFiles(data.files);
      console.log("Files uploaded:", data.files);
    } catch (error) {
      // show both us and user error
      console.error("Upload error:", error);
      alert("Upload failed: " + error.message);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload Files</button>
    </div>
  );
};

export default FileUpload;
