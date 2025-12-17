// src/pages/GaragePage.tsx
import React, { useState, useEffect } from "react";
import { getCars, createCar, deleteCar } from "../api/garageApi";
import CarItem from "../components/CarItem";
import WinnerModal from "../components/WinnerModal";
import { saveWinner } from "../api/winnersApi";

const GaragePage = () => {
  const [cars, setCars] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<any>(null);
  const [selectedCar, setSelectedCar] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("#000000");

  const limit = 7;

  const loadCars = async () => {
    const { data, total } = await getCars(page, limit);
    setCars(data);
    setTotal(total);
  };

  useEffect(() => {
    loadCars();
  }, [page]);

  const handleCreate = async () => {
    const name = (document.getElementById("create-name") as HTMLInputElement).value.trim();
    const color = (document.getElementById("create-color") as HTMLInputElement).value;
    if (name) {
      await createCar(name, color);
      loadCars();
      (document.getElementById("create-name") as HTMLInputElement).value = "";
    }
  };

  const handleUpdate = async () => {
    if (selectedCar && editName.trim()) {
      await fetch(`https://async-race-api-2025.onrender.com/garage/${selectedCar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, color: editColor }),
      });
      setSelectedCar(null);
      loadCars();
    }
  };

  const generate100 = async () => {
    const brands = ["Tesla", "BMW", "Audi", "Mercedes", "Ferrari"];
    const models = ["Model S", "X5", "A8", "S-Class", "488"];
    for (let i = 0; i < 100; i++) {
      const name = `${brands[Math.floor(Math.random() * brands.length)]} ${models[Math.floor(Math.random() * models.length)]}`;
      const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
      await createCar(name, color);
    }
    loadCars();
  };

  useEffect(() => {
    const handleFinish = (e: any) => {
      if (!isRacing) return;
      const { car, time } = e.detail;
      setWinner({ name: car.name, time: (time / 1000).toFixed(2) });
      saveWinner(car.id, time / 1000);
      setIsRacing(false);
    };
    window.addEventListener("car-finished", handleFinish);
    return () => window.removeEventListener("car-finished", handleFinish);
  }, [isRacing]);

  const startAll = () => {
    setIsRacing(true);
    cars.forEach(car => window.dispatchEvent(new CustomEvent("start-car", { detail: car.id })));
  };

  const resetAll = () => {
    setIsRacing(false);
    cars.forEach(car => window.dispatchEvent(new CustomEvent("stop-car", { detail: car.id })));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#00ffff", fontSize: "3rem" }}>
        GARAGE ({total} cars)
      </h1>

      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <input id="create-name" placeholder="Car name" style={{ padding: "12px", width: "300px" }} />
        <input type="color" id="create-color" defaultValue="#ff0000" />
        <button onClick={handleCreate} style={{ padding: "12px 30px", marginLeft: "20px" }}>Create</button>
      </div>

      {selectedCar && (
        <div style={{ textAlign: "center", margin: "30px 0" }}>
          <input value={editName} onChange={e => setEditName(e.target.value)} style={{ padding: "12px", width: "300px" }} />
          <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} />
          <button onClick={handleUpdate} style={{ padding: "12px 30px", marginLeft: "20px" }}>Update</button>
        </div>
      )}

      <div style={{ textAlign: "center", margin: "50px 0" }}>
        <button onClick={startAll} disabled={isRacing} style={{ padding: "20px 60px", fontSize: "2rem" }}>RACE!</button>
        <button onClick={resetAll} style={{ padding: "20px 50px", fontSize: "1.8rem", marginLeft: "20px" }}>RESET</button>
        <button onClick={generate100} style={{ padding: "20px 50px", fontSize: "1.6rem", marginLeft: "20px" }}>Generate 100 cars</button>
      </div>

      <div>
        {cars.map(car => (
          <CarItem key={car.id} car={car} onSelect={setSelectedCar} onDelete={deleteCar} />
        ))}
      </div>

      <div style={{ textAlign: "center", margin: "60px 0" }}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
        <span style={{ margin: "0 40px", fontSize: "1.8rem" }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}>Next</button>
      </div>

      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} />}
    </div>
  );
};

export default GaragePage;