// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import GaragePage from "./pages/GaragePage";
import WinnersPage from "./pages/WinnersPage";
import './index.css';

function Nav() {
  const location = useLocation();
  const isGarage = location.pathname === "/";

  return (
    <nav style={{
      padding: "40px 20px",
      textAlign: "center",
      background: "rgba(0,0,0,0.8)",
      borderBottom: "3px solid #00f0ff",
      boxShadow: "0 0 30px #00f0ff"
    }}>
      <div style={{ fontSize: "4rem", fontWeight: 900, marginBottom: 20 }}>
        <span className="neon-text">ASYNC</span>
        <span style={{ marginLeft: 20 }} className="neon-pink">RACE</span>
      </div>
      <div style={{ fontSize: "2rem", marginTop: 20 }}>
        <Link 
          to="/" 
          style={{ 
            color: isGarage ? "#00f0ff" : "#666", 
            margin: "0 50px",
            textDecoration: "none",
            padding: "10px 30px",
            border: isGarage ? "2px solid #00f0ff" : "none",
            borderRadius: 10,
            boxShadow: isGarage ? "0 0 20px #00f0ff" : "none"
          }}
        >
          GARAGE
        </Link>
        <Link 
          to="/winners" 
          style={{ 
            color: !isGarage ? "#ff00ff" : "#666", 
            margin: "0 50px",
            textDecoration: "none",
            padding: "10px 30px",
            border: !isGarage ? "2px solid #ff00ff" : "none",
            borderRadius: 10,
            boxShadow: !isGarage ? "0 0 20px #ff00ff" : "none"
          }}
        >
          WINNERS
        </Link>
      </div>
    </nav>
  );
}

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