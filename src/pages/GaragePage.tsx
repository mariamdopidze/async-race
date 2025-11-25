
import React, { useState, useEffect } from "react";
import { useGarage } from "../hooks/useGarage";
import CarItem from "../components/CarItem";
import AddCarForm from "../components/AddCarForm";
import RaceControls from "../components/RaceControls";
import WinnerModal from "../components/WinnerModal";
import Pagination from "../components/Pagination";
import { generate100Cars } from "../utils/generateCars";

interface Winner {
  car: { id: number; name: string; color: string };
  time: number;
}

const GaragePage: React.FC = () => {
  const { cars, loading, addNewCar, deleteCar } = useGarage();
  const [page, setPage] = useState(1);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);
  const limit = 7;

  const currentCars = cars.slice((page - 1) * limit, page * limit);

  
  const saveWinner = async (carId: number, time: number) => {
    const { getWinner, createWinner, updateWinner } = await import("../api/winnersApi");
    const existing = await getWinner(carId);
    const seconds = Number((time / 1000).toFixed(2));

    if (existing) {
      const wins = existing.wins + 1;
      const bestTime = Math.min(existing.time, seconds);
      await updateWinner(carId, wins, bestTime);
    } else {
      await createWinner({ id: carId, wins: 1, time: seconds });
    }
  };


  useEffect(() => {
    const handleCarFinish = ((e: CustomEvent) => {
      if (!isRacing) return;
      const { car, time } = e.detail;
      setWinner({ car, time });
      saveWinner(car.id, time); 
      setIsRacing(false);
    }) as EventListener;

    window.addEventListener("car-finished", handleCarFinish);
    return () => window.removeEventListener("car-finished", handleCarFinish);
  }, [isRacing]);

  const startRace = () => {
    if (isRacing) return;
    setIsRacing(true);
    setWinner(null);
    currentCars.forEach((car) => {
      window.dispatchEvent(new CustomEvent("start-car", { detail: car.id }));
    });
  };

  const resetRace = () => {
    setIsRacing(false);
    setWinner(null);
    currentCars.forEach((car) => {
      window.dispatchEvent(new CustomEvent("stop-car", { detail: car.id }));
    });
  };

  const handleGenerate = async () => {
    if (confirm("დარწმუნებული ხარ? 100 მანქანა შეიქმნება!")) {
      await generate100Cars();
      alert("100 მანქანა წარმატებით შეიქმნა!");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f4f4f4" }}>
      <h1 style={{ fontSize: "3rem", textAlign: "center", color: "#d40000" }}>
        GARAGE ({cars.length} cars)
      </h1>

      <AddCarForm onAdd={addNewCar} />

      <RaceControls
        onRaceStart={startRace}
        onRaceReset={resetRace}
        onGenerateCars={handleGenerate}
        isRacing={isRacing}
      />

      {loading && <p style={{ textAlign: "center", fontSize: "1.5rem" }}>იტვირთება მანქანები...</p>}
      {!loading && currentCars.length === 0 && (
        <p style={{ textAlign: "center", fontSize: "2rem", color: "#666" }}>გარაჟი ცარიელია</p>
      )}

      <div>
        {currentCars.map((car) => (
          <CarItem key={car.id} car={car} onDelete={deleteCar} onSelect={() => {}} />
        ))}
      </div>

      <Pagination page={page} total={cars.length} limit={limit} onChange={setPage} />

      <WinnerModal
        winner={winner ? { name: winner.car.name, time: winner.time } : null}
        onClose={() => setWinner(null)}
      />
    </div>
  );
};

export default GaragePage;