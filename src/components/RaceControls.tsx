// src/components/RaceControls.tsx
import React from "react";

interface Props {
  onRaceStart: () => void;
  onRaceReset: () => void;
  onGenerateCars: () => void;   // ← ასე უნდა ყოფილიყო!
  isRacing: boolean;
}

const RaceControls: React.FC<Props> = ({
  onRaceStart,
  onRaceReset,
  onGenerateCars,
  isRacing,
}) => {
  return (
    <div style={{ margin: "30px 0", textAlign: "center" }}>
   <button
  onClick={onRaceStart}
  disabled={isRacing}
  style={{
    background: isRacing ? "#333" : "linear-gradient(45deg, #ff0066, #ff00ff)",
    color: "white",
    padding: "20px 60px",
    fontSize: "2rem",
    boxShadow: isRacing ? "none" : "0 0 40px #ff00ff",
    border: "3px solid #ff00ff"
  }}
>
  RACE!
</button>

      <button
        onClick={onRaceReset}
        disabled={!isRacing}
        style={{ padding: "15px 30px", fontSize: "1.2rem", margin: "0 10px" }}
      >
        Reset
      </button>

      <button
        onClick={onGenerateCars}
        style={{ padding: "15px 25px", fontSize: "1.2rem", margin: "0 10px" }}
      >
        Generate 100 cars
      </button>
    </div>
  );
};

export default RaceControls;