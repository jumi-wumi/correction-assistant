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
    <>
      <div className="bg-darkest p-6 rounded-2xl border-b shadow-xl border-purple text-center flex flex-col sm:flex-row sm:items-center sm:gap-4 w-full justify-center">
        {/* <label className="text-brown font-medium sm:w-1/4 text-center sm:text-right mb-2 sm:mb-0">
          Välj filer:
        </label> */}
        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-medium file:px-4 file:py-2 file:rounded-xl file:font-semibold file:cursor-pointer file:border-1 file:rounded file:border-[#6940a5]"
        />
        <button
          onClick={handleUpload}
          className="mt-4 bg-dark text-darkest px-6 py-2 rounded-xl cursor-pointer  hover:bg-purple hover:text-darkest shadow-lg"
        >
          Ladda upp filer
        </button>
      </div>
    </>
  );
};

export default FileUpload;
