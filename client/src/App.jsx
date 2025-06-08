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
    <div className="min-h-screen bg-[#f7f4f3] text-[#64473a] font-['Inter'] uppercase">
      <Dashboard />
    </div>
  );
}

export default App;
