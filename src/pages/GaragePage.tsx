// src/pages/GaragePage.tsx
import React, { useState, useEffect } from "react";
import { useGarage } from "../hooks/useGarage";
import CarItem from "../components/CarItem";
import WinnerModal from "../components/WinnerModal";
const BASE_URL = "https://async-race-api-mariam.onrender.com";

const GaragePage = () => {
  const { cars, addNewCar, updateCar, deleteCar, loading } = useGarage();
  const [page, setPage] = useState(1);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<{ name: string; time: string } | null>(null);
  const [selectedCar, setSelectedCar] = useState<any>(null); // for edit
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#000000");

  const carsPerPage = 7;
  const startIdx = (page - 1) * carsPerPage;
  const visibleCars = cars.slice(startIdx, startIdx + carsPerPage);

  
  const saveWinner = async (carId: number, timeInMs: number) => {
    try {
      const seconds = Number((timeInMs / 1000).toFixed(2));
      const res = await fetch(`${BASE_URL}/winners/${carId}`);

      if (res.ok) {
        const data = await res.json();
        const newWins = data.wins + 1;
        const bestTime = Math.min(data.time, seconds);
        await fetch(`${BASE_URL}/winners/${carId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wins: newWins, time: bestTime }),
        });
      } else {
        await fetch(`${BASE_URL}/winners`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: carId, wins: 1, time: seconds }),
        });
      }
    } catch (err) {
      console.log("შეცდომა გამარჯვებულის შენახვისას", err);
    }
  };

  useEffect(() => {
    const handleFinish = (e: any) => {
      if (!isRacing) return;
      const { car, time } = e.detail;
      setWinner({ name: car.name, time: (time / 1000).toFixed(2) });
      saveWinner(car.id, time);
      setIsRacing(false);
    };
    window.addEventListener("car-finished", handleFinish);
    return () => window.removeEventListener("car-finished", handleFinish);
  }, [isRacing]);

  const startRace = () => {
    if (isRacing) return;
    setIsRacing(true);
    setWinner(null);
    visibleCars.forEach((car) => {
      window.dispatchEvent(new CustomEvent("start-car", { detail: car.id }));
    });
  };

  const resetRace = () => {
    setIsRacing(false);
    visibleCars.forEach((car) => {
      window.dispatchEvent(new CustomEvent("stop-car", { detail: car.id }));
    });
  };

  // Generate 100 random cars
  const generateCars = async () => {
    <button
  onClick={async () => {
    if (!confirm("100 მანქანა შეიქმნება?")) return;

    const brands = ["Tesla", "BMW", "Audi", "Mercedes", "Ferrari", "Lamborghini", "Toyota", "Honda", "Ford", "Porsche"];
    const models = ["Model S", "X5", "A8", "S-Class", "488", "Huracan", "Camry", "Civic", "Mustang", "911"];

    for (let i = 0; i < 100; i++) {
      const name = `${brands[Math.floor(Math.random() * brands.length)]} ${models[Math.floor(Math.random() * models.length)]}`;
      const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
      await addNewCar(name, color);
    }

    alert("100 მანქანა შეიქმნა! გადატვირთე გვერდი");
  }}
  style={{ /* შენი სტილი */ }}
>
  Generate 100 cars
</button>
  };

  // Update car
  const handleUpdate = () => {
    if (selectedCar && editName.trim()) {
      updateCar(selectedCar.id, editName, editColor);
      setSelectedCar(null);
      setEditName("");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>GARAGE ({cars.length} cars)</h1>

      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <input id="create-name" placeholder="Car name" style={{ padding: 10, marginRight: 10 }} />
        <input type="color" id="create-color" defaultValue="#ff0000" />
        <button onClick={() => {
          const name = (document.getElementById("create-name") as HTMLInputElement).value.trim();
          const color = (document.getElementById("create-color") as HTMLInputElement).value;
          if (name) {
            addNewCar(name, color);
            (document.getElementById("create-name") as HTMLInputElement).value = "";
          }
        }}>Create</button>
      </div>

      {selectedCar && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="New name" style={{ padding: 10, marginRight: 10 }} />
          <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} />
          <button onClick={handleUpdate}>Update</button>
        </div>
      )}

      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <button onClick={startRace} disabled={isRacing}>Race</button>
        <button onClick={resetRace}>Reset</button>
        <button onClick={generateCars}>Generate 100 cars</button>
      </div>

      {loading ? <p>Loading...</p> : visibleCars.map(car => (
        <CarItem key={car.id} car={car} onDelete={deleteCar} onSelect={(car) => {
          setSelectedCar(car);
          setEditName(car.name);
          setEditColor(car.color);
        }} />
      ))}

      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={startIdx + carsPerPage >= cars.length}>Next</button>
      </div>

      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} />}
    </div>
  );
};

export default GaragePage;