
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
      console.log("ვერ შევინახე გამარჯვებული");
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
    <div style={{ padding: "40px", minHeight: "100vh", background: "linear-gradient(135deg, #0a001a, #1a0033)" }}>
      
      <h1 style={{
        textAlign: "center",
        fontSize: "4.5rem",
        fontWeight: "bold",
        background: "linear-gradient(90deg, #00ffff, #ff00ff)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0 0 40px #ff00ff",
        marginBottom: "50px"
      }}>
        GARAGE — {cars.length} CARS
      </h1>

    
      <div style={{ textAlign: "center", margin: "50px 0" }}>
        <input
          id="car-name"
          placeholder="მანქანის სახელი"
          style={{
            padding: "16px",
            width: "320px",
            fontSize: "1.3rem",
            background: "rgba(255,255,255,0.1)",
            border: "2px solid #00ffff",
            borderRadius: "12px",
            color: "white",
            marginRight: "20px"
          }}
        />
        <input type="color" id="car-color" defaultValue="#00ffff" style={{ width: "70px", height: "56px", borderRadius: "12px" }} />
        
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
            padding: "16px 40px",
            fontSize: "1.5rem",
            background: "linear-gradient(45deg, #00ffff, #0080ff)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            marginLeft: "30px",
            cursor: "pointer",
            boxShadow: "0 0 30px #00ffff"
          }}
        >
          CREATE CAR
        </button>
      </div>

    
      <div style={{
        textAlign: "center",
        margin: "80px 0",
        display: "flex",
        justifyContent: "center",
        gap: "50px",
        flexWrap: "wrap"
      }}>
        <button
          onClick={startRace}
          disabled={isRacing}
          style={{
            padding: "25px 90px",
            fontSize: "2.8rem",
            fontWeight: "bold",
            background: isRacing ? "#444" : "linear-gradient(45deg, #ff0080, #ff00ff, #8000ff)",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: isRacing ? "not-allowed" : "pointer",
            boxShadow: isRacing ? "none" : "0 0 60px #ff00ff, 0 0 80px #ff00ff inset",
            minWidth: "320px",
            transition: "all 0.4s"
          }}
        >
          {isRacing ? "RACING..." : "RACE!"}
        </button>

        <button
          onClick={resetRace}
          disabled={isRacing}
          style={{
            padding: "25px 70px",
            fontSize: "2.4rem",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: isRacing ? "not-allowed" : "pointer",
            boxShadow: "0 0 40px #6c757d",
            minWidth: "280px"
          }}
        >
          RESET
        </button>

        <button
          onClick={() => alert("100 მანქანა მალე დაემატება")}
          style={{
            padding: "25px 70px",
            fontSize: "2rem",
            background: "linear-gradient(45deg, #7c3aed, #ec4899, #f43f5e)",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            boxShadow: "0 0 50px #ec4899",
            minWidth: "320px"
          }}
        >
          Generate 100 cars
        </button>
      </div>

     
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
        {loading ? (
          <p style={{ textAlign: "center", fontSize: "2rem", color: "#666", margin: "100px" }}>იტვირთება...</p>
        ) : visibleCars.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "3rem", color: "#444", margin: "100px" }}>გარაჟი ცარიელია</p>
        ) : (
          visibleCars.map((car) => (
            <CarItem key={car.id} car={car} onDelete={deleteCar} onSelect={() => {}} />
          ))
        )}
      </div>

    
      <div style={{ textAlign: "center", margin: "80px 0" }}>
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ padding: "15px 40px", fontSize: "1.6rem", margin: "0 20px", background: "#333", color: "white", border: "2px solid #00ffff", borderRadius: "12px" }}
        >
          ← Previous
        </button>
        <span style={{ fontSize: "2.2rem", margin: "0 50px", color: "#00ffff", textShadow: "0 0 20px #00ffff" }}>
          Page {page}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={startIdx + carsPerPage >= cars.length}
          style={{ padding: "15px 40px", fontSize: "1.6rem", margin: "0 20px", background: "#333", color: "white", border: "2px solid #ff00ff", borderRadius: "12px" }}
        >
          Next →
        </button>
      </div>

     
      {winner && <WinnerModal winner={winner} onClose={() => setWinner(null)} />}
    </div>
  );
};

export default GaragePage;