
import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ marginLeft: "10px" }}
    />
  );
};

export default ColorPicker;
