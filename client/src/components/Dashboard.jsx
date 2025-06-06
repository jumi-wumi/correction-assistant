// This is the parent container
import { useState } from "react";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import AssessmentModal from "./AssessmentModal";

const Dashboard = () => {
  // state for storing the uploaded files
  const [files, setFiles] = useState([]);
  // state for the info about the files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // state for file url if selected to view
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  // state for notion URL
  const [notionUrl, setNotionUrl] = useState("");
  // state to toggle modal visibility
  const [showModal, setShowModal] = useState(false);
  // state to store the results from assessment
  const [assessmentResults, setAssessmentResults] = useState({});
  // state to track if an assessment is in progress
  const [isAssessing, setIsAssessing] = useState(false);

  return (
    <>
      <FileUpload
        files={files}
        setFiles={setFiles}
        setUploadedFiles={setUploadedFiles}
      />

      <FileList
        uploadedFiles={uploadedFiles}
        assessmentResults={assessmentResults}
        setShowModal={setShowModal}
        setSelectedFileUrl={setSelectedFileUrl}
        selectedFileUrl={selectedFileUrl}
      />

      {showModal && (
        <AssessmentModal
          files={files}
          notionUrl={notionUrl}
          setNotionUrl={setNotionUrl}
          setAssessmentResults={setAssessmentResults}
          setIsAssessing={setIsAssessing}
          isAssessing={isAssessing}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default Dashboard;
