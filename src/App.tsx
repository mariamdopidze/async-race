
import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import GaragePage from "./pages/GaragePage";
import WinnersPage from "./pages/WinnersPage";
import "./index.css";

const Nav = () => {
  const location = useLocation();
  const isWinners = location.pathname === "/winners";

  return (
    <nav style={{
      padding: "40px",
      textAlign: "center",
      background: "rgba(0,0,0,0.7)",
      borderBottom: "4px solid #00ffff",
      boxShadow: "0 0 40px #00ffff"
    }}>
      <div style={{ fontSize: "5rem", marginBottom: "20px" }}>
        <span className="neon-text">ASYNC</span>
        <span className="neon-pink" style={{ marginLeft: "30px" }}>RACE</span>
      </div>
      <div>
        <Link to="/" className="neon-btn" style={{ margin: "0 40px", fontSize: "2rem" }}>
          GARAGE
        </Link>
        <Link to="/winners" className="neon-btn" style={{ 
          margin: "0 40px", 
          fontSize: "2rem",
          borderColor: "#ff00ff",
          color: "#ff00ff",
          boxShadow: "0 0 30px #ff00ff"
        }}>
          WINNERS
        </Link>
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<GaragePage />} />
        <Route path="/winners" element={<WinnersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;