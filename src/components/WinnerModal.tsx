import React from "react";

const WinnerModal = ({ winner, onClose }: any) => {
  if (!winner) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center"
    }} onClick={onClose}>
      <div style={{ background: "#1f6feb", padding: "50px 80px", borderRadius: 20, textAlign: "center" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: "3rem" }}>WINNER!</h2>
        <h3 style={{ fontSize: "2.5rem", margin: "20px 0" }}>{winner.name}</h3>
        <p style={{ fontSize: "2rem" }}>Time: {winner.time} sec</p>
        <button onClick={onClose} style={{ marginTop: 30, padding: "15px 40px", fontSize: "1.3rem" }}>OK</button>
      </div>
    </div>
  );
};

export default WinnerModal;