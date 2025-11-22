// src/components/WinnerModal.tsx
import React from "react";

interface Winner {
  name: string;
  time: number;
}

interface Props {
  winner: Winner | null;
  onClose: () => void;
}

const WinnerModal: React.FC<Props> = ({ winner, onClose }) => {
  if (!winner) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(45deg, gold, orange)",
          padding: "50px 80px",
          borderRadius: "30px",
          textAlign: "center",
          boxShadow: "0 0 50px gold",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 style={{ fontSize: "5rem", margin: "0 0 20px 0", color: "black" }}>
          WINNER!
        </h1>
        <h2 style={{ fontSize: "3rem", margin: "20px 0", color: "black" }}>
          {winner.name}
        </h2>
        <p style={{ fontSize: "2.5rem", color: "black", fontWeight: "bold" }}>
          {(winner.time / 1000).toFixed(2)} sec
        </p>
        <button
          onClick={onClose}
          style={{
            marginTop: 30,
            padding: "15px 40px",
            fontSize: "1.5rem",
            background: "black",
            color: "gold",
            border: "3px solid gold",
            borderRadius: 15,
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;