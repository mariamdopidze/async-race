// src/components/WinnerModal.tsx
import React from "react";

interface Props {
  winner: { name: string; time: string };
  onClose: () => void;
}

const WinnerModal: React.FC<Props> = ({ winner, onClose }) => {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: "#000", padding: "60px", borderRadius: "30px", textAlign: "center", border: "5px solid #ff00ff", boxShadow: "0 0 60px #ff00ff" }} onClick={e => e.stopPropagation()}>
        <h1 style={{ fontSize: "5rem", color: "#ff00ff" }}>WINNER!</h1>
        <h2 style={{ fontSize: "3rem", color: "#00ffff" }}>{winner.name}</h2>
        <p style={{ fontSize: "2.5rem", color: "#fff" }}>Time: {winner.time} s</p>
        <button onClick={onClose} style={{ padding: "15px 40px", fontSize: "1.5rem", marginTop: "30px" }}>Close</button>
      </div>
    </div>
  );
};

export default WinnerModal;