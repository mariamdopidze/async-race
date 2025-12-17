// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GaragePage from "./pages/GaragePage";
import WinnersPage from "./pages/WinnersPage";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ textAlign: "center", padding: "40px", background: "#000" }}>
        <Link to="/" style={{ margin: "0 50px", fontSize: "3rem", color: "#00ffff" }}>GARAGE</Link>
        <Link to="/winners" style={{ margin: "0 50px", fontSize: "3rem", color: "#ff00ff" }}>WINNERS</Link>
      </nav>
      <Routes>
        <Route path="/" element={<GaragePage />} />
        <Route path="/winners" element={<WinnersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;