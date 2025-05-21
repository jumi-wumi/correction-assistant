import { useEffect } from 'react'
import './App.css'
// import Assistant from './components/Assistant';
// import UploadZip from './components/UploadZip';
import FolderUpload from './components/FolderUpload';

function App() {

  const fetchAPI = async () => {
    const response = await fetch("http://localhost:3000/");
    console.log(response);
  }

  useEffect(() => {
    fetchAPI();
  })

  return (
    <>
    {/* <Assistant /> */}
    <FolderUpload />
    </>
  )
}

export default App
