import React from 'react';

interface Props {
  name: string;
  color: string;
  onDelete: () => void;
  onEdit: () => void;
  onStart: () => void;
  onStop: () => void;
}

const CarCard: React.FC<Props> = ({
  name,
  color,
  onDelete,
  onEdit,
  onStart,
  onStop,
}) => {
  return (
    <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
      <h3>{name}</h3>
      <svg width="100" height="40">
        <rect width="100" height="40" fill={color} />
      </svg>

      <div style={{ marginTop: '10px' }}>
        <button onClick={onStart}>Start</button>
        <button onClick={onStop}>Stop</button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default CarCard;
