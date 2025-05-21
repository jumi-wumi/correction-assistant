import { useEffect } from 'react'
import './App.css'
// import Assistant from './components/Assistant';
import UploadZip from './components/UploadZip';

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
    <UploadZip />
    </>
  )
}

export default App
