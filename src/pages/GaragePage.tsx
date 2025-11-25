
import React, { useState, useEffect } from "react";
import { useGarage } from "../hooks/useGarage";
import CarItem from "../components/CarItem";
import WinnerModal from "../components/WinnerModal";

const GaragePage = () => {
  const { cars, addNewCar, deleteCar, loading } = useGarage();
  const [page, setPage] = useState(1);
  const [isRacing, setIsRacing] = useState(false);
  const [winner, setWinner] = useState<{ name: string; time: string } | null>(null);

  const carsPerPage = 7;
  const startIdx = (page - 1) * carsPerPage;
  const visibleCars = cars.slice(startIdx, startIdx + carsPerPage);

  const saveWinner = async (carId: number, timeInMs: number) => {
    try {
      const seconds = Number((timeInMs / 1000).toFixed(2));
      const res = await fetch(`http://127.0.0.1:3000/winners/${carId}`);

      if (res.ok) {
        const data = await res.json();
        const newWins = data.wins + 1;
        const bestTime = Math.min(data.time, seconds);
        await fetch(`http://127.0.0.1:3000/winners/${carId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wins: newWins, time: bestTime }),
        });
      } else {
        await fetch("http://127.0.0.1:3000/winners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: carId, wins: 1, time: seconds }),
        });
      }
    } catch (err) {
      console.log("ვერ შევინახე გამარჯვებული", err);
    }
  };


  useEffect(() => {
    const handleFinish = (e: any) => {
      if (!isRacing) return;
      const { carId, carName, time } = e.detail;
      setWinner({ name: carName, time: (time / 1000).toFixed(2) });
      saveWinner(carId, time);
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

  return (
    <div style={{ padding: "30px", background: "#0d1117", minHeight: "100vh" }}>
     <h1 className="neon-text" style={{ fontSize: "4rem", margin: "40px 0" }}>
  GARAGE — {cars.length} cars
</h1>

     
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <input
          id="car-name"
          placeholder="მანქანის სახელი"
          style={{
            padding: "14px",
            width: "280px",
            fontSize: "1.1rem",
            borderRadius: "8px",
            border: "2px solid #30363d",
            marginRight: "15px",
          }}
        />
        <input
          type="color"
          id="car-color"
          defaultValue="#ff0000"
          style={{ width: "60px", height: "52px", cursor: "pointer", borderRadius: "8px" }}
        />
        <button
          onClick={() => {
            const nameInput = document.getElementById("car-name") as HTMLInputElement;
            const colorInput = document.getElementById("car-color") as HTMLInputElement;
            const name = nameInput.value.trim();

            if (!name) {
              alert("დაარქვი სახელი მანქანას!");
              return;
            }

            addNewCar(name, colorInput.value);  
            nameInput.value = "";
          }}
          style={{
            padding: "14px 35px",
            fontSize: "1.3rem",
            background: "#238636",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginLeft: "20px",
            cursor: "pointer",
          }}
        >
          CREATE CAR
        </button>
      </div>

    
      <div style={{ textAlign: "center", margin: "50px 0" }}>
        <button className="neon-btn race-btn" onClick={startRace} disabled={isRacing}>
  RACE!
</button>

        <button
          onClick={resetRace}
          style={{
            padding: "18px 50px",
            fontSize: "1.8rem",
            background: "#8b949e",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          RESET
        </button>

        <button
          onClick={() => alert("100 მანქანა მალე დაემატება :)")}
          style={{
            padding: "18px 40px",
            fontSize: "1.5rem",
            background: "#8957e5",
            color: "white",
            border: "none",
            borderRadius: "12px",
            marginLeft: "30px",
            cursor: "pointer",
          }}
        >
          Generate 100
        </button>
      </div>

     
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {loading ? (
          <p style={{ textAlign: "center", fontSize: "1.5rem", color: "#666" }}>იტვირთება მანქანები...</p>
        ) : visibleCars.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "2rem", color: "#666" }}>გარაჟი ცარიელია</p>
        ) : (
          visibleCars.map((car) => (
            <CarItem key={car.id} car={car} onDelete={deleteCar} onSelect={() => {}} />
          ))
        )}
      </div>

     
      <div style={{ textAlign: "center", margin: "60px 0" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: "12px 30px", fontSize: "1.3rem", margin: "0 15px" }}
        >
          ← Previous
        </button>
        <span style={{ fontSize: "1.8rem", margin: "0 40px", color: "#58a6ff" }}>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={startIdx + carsPerPage >= cars.length}
          style={{ padding: "12px 30px", fontSize: "1.3rem", margin: "0 15px" }}
        >
          Next →
        </button>
      </div>

      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} />}
    </div>
  );
};

export default GaragePage;