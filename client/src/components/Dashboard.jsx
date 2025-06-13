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
    <div className="min-h-screen bg-darkest text-white p-6 font-mono tracking-wider uppercase">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-dark">qlok bajs</h1>
      </header>

      <main className="max-w-4xl mx-auto space-y-8 ">
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
      </main>
    </div>
  );
};

export default Dashboard;
