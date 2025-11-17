// src/components/CarForm.tsx
import React, { useState } from "react";

interface Props {
  onSubmit: (name: string, color: string) => void;
  initialName?: string;
  initialColor?: string;
}

const CarForm: React.FC<Props> = ({ onSubmit, initialName = "", initialColor = "#000000" }) => {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert("Name is required");
    onSubmit(name, color);
    setName("");
    setColor("#000000");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Car name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        style={{ marginLeft: "10px" }}
      />
      <button type="submit" style={{ marginLeft: "10px" }}>Add Car</button>
    </form>
  );
};

export default CarForm;
