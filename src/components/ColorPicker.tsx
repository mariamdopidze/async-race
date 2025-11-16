type ColorPickerProps = {
  value: string;
  onChange: (value: string) => void;
};

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <input
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default ColorPicker;
