import { useEffect } from 'react'
import './App.css'

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

    </>
  )
}

export default App
