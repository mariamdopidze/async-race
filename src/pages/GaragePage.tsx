// src/pages/GaragePage.tsx
import React, { useState } from "react";
import { useGarage } from "../hooks/useGarage";
import AddCarForm from "../components/AddCarForm";
import Pagination from "../components/Pagination";
import RaceControls from "../components/RaceControls";

const GaragePage: React.FC = () => {
  const { cars, loading, error, addNewCar, updateCar, deleteCar } = useGarage();
  const [page, setPage] = useState(1);
  const limit = 7; // cars per page
  const total = cars.length;

  const handleEdit = (car: typeof cars[0]) => {
    const newName = prompt("New name:", car.name);
    const newColor = prompt("New color:", car.color);
    if (newName && newColor) {
      updateCar(car.id, newName, newColor);
    }
  };

  const handleRaceStart = () => {
    alert("Race started!");
  };

  const handleRaceReset = () => {
    alert("Race reset!");
  };

  const handleGenerate = () => {
    alert("100 cars generated!");
  };

  const paginatedCars = cars.slice((page - 1) * limit, page * limit);

  return (
    <div>
      <h1>Garage</h1>

      <AddCarForm onAdd={addNewCar} />

      <RaceControls
        onRaceStart={handleRaceStart}
        onRaceReset={handleRaceReset}
        onGenerate={handleGenerate}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {paginatedCars.length === 0 ? (
        <p>No cars yet</p>
      ) : (
        <ul>
          {paginatedCars.map((car) => (
            <li key={car.id}>
              <span>{car.name} - {car.color} </span>
              <button onClick={() => handleEdit(car)}>Edit</button>
              <button onClick={() => deleteCar(car.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        total={total}
        limit={limit}
        onChange={setPage}
      />
    </div>
  );
};

export default GaragePage;
