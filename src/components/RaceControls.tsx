// src/components/RaceControls.tsx
import React from "react";

interface Props {
  onRaceStart: () => void;
  onRaceReset: () => void;
  onGenerate: () => void;
}

const RaceControls: React.FC<Props> = ({ onRaceStart, onRaceReset, onGenerate }) => {
  return (
    <div style={{ margin: "20px 0" }}>
      <button onClick={onRaceStart}>Start Race</button>
      <button onClick={onRaceReset}>Reset Race</button>
      <button onClick={onGenerate}>Generate 100 Cars</button>
    </div>
  );
};

export default RaceControls;
