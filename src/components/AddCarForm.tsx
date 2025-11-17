// src/components/AddCarForm.tsx
import React, { useState } from "react";
import ColorPicker from "./ColorPicker";

interface Props {
  onAdd: (name: string, color: string) => void;
}

const AddCarForm: React.FC<Props> = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, color);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Car Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <ColorPicker value={color} onChange={setColor} />
      <button type="submit" style={{ marginLeft: "10px" }}>Add Car</button>
    </form>
  );
};

export default AddCarForm;
