import { useEffect } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";

function App() {
  const fetchAPI = async () => {
    const response = await fetch("http://localhost:3000/");
    console.log(response);
  };

  useEffect(() => {
    fetchAPI();
  });

  return (
    <div className="min-h-screen">
      <Dashboard />
    </div>
  );
}

export default App;
