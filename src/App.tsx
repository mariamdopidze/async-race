// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import GaragePage from "./pages/GaragePage";
import WinnersPage from "./pages/WinnersPage";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: "20px" }}>
        <Link to="/">Garage</Link>
        <Link to="/winners">Winners</Link>
      </nav>

      <Routes>
        <Route path="/" element={<GaragePage />} />
        <Route path="/winners" element={<WinnersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
