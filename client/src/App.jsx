import { useEffect } from 'react'
import './App.css'
import Dashboard from './components/Dashboard';

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
    <Dashboard />
    </>
  )
}

export default App
