// src/components/CarItem.tsx
import React, { useEffect, useRef } from "react";
import { Car } from "../api/garageApi";
import { startEngine, stopEngine, switchToDrive } from "../api/engineApi";

interface Props {
  car: Car;
  onDelete: (id: number) => void;
  onSelect: (car: Car) => void;
}

const CarItem: React.FC<Props> = ({ car, onDelete, onSelect }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number | null>(null);
  const isRacing = useRef(false);

  const startEngineAndRace = async () => {
    if (isRacing.current) return;
    isRacing.current = true;

    try {
      // 1. ძრავის ჩართვა — ვიღებთ velocity და distance
      const { velocity, distance } = await startEngine(car.id);
      const duration = Math.round(distance / velocity); // ms-ში

      // 2. Drive რეჟიმი — თუ 500 მივიღეთ, მანქანა ჩერდება
      const driveRes = await switchToDrive(car.id);
      if (!driveRes.success) {
        console.log("მანქანა გაიჭედა (broken)", car.name);
        isRacing.current = false;
        return;
      }

      // 3. ანიმაცია
      if (!trackRef.current || !carRef.current) return;

      const trackWidth = trackRef.current.offsetWidth - carRef.current.offsetWidth - 50; // მარჯინი

      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const position = progress * trackWidth;

        if (carRef.current) {
          carRef.current.style.transform = `translateX(${position}px)`;
        }

        if (progress < 1) {
          animationId.current = requestAnimationFrame(animate);
        } else {
          // ფინიში — ვაგზავნით event-ს
          window.dispatchEvent(
            new CustomEvent("car-finished", {
              detail: { car, time: duration },
            })
          );
          isRacing.current = false;
        }
      };

      animationId.current = requestAnimationFrame(animate);
    } catch (err) {
      console.log("შეცდომა ძრავის ჩართვისას", err);
      isRacing.current = false;
    }
  };

  const stopEngineAndReset = async () => {
    if (animationId.current) {
      cancelAnimationFrame(animationId.current);
      animationId.current = null;
    }
    if (carRef.current) {
      carRef.current.style.transform = "translateX(0)";
    }
    try {
      await stopEngine(car.id);
    } catch (err) {
      console.log("შეცდომა ძრავის გაჩერებისას", err);
    }
    isRacing.current = false;
  };

  useEffect(() => {
    const handleStart = (e: CustomEvent<number>) => {
      if (e.detail === car.id) startEngineAndRace();
    };
    const handleStop = (e: CustomEvent<number>) => {
      if (e.detail === car.id) stopEngineAndReset();
    };

    window.addEventListener("start-car", handleStart as EventListener);
    window.addEventListener("stop-car", handleStop as EventListener);

    return () => {
      window.removeEventListener("start-car", handleStart as EventListener);
      window.removeEventListener("stop-car", handleStop as EventListener);
    };
  }, [car.id]);

  return (
    <div style={{ margin: "40px 0", padding: "20px", background: "rgba(0,0,0,0.6)", borderRadius: "15px", border: "2px solid #444" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ color: "#00ffff", fontSize: "1.8rem" }}>{car.name}</h3>
        <div>
          <button onClick={() => onSelect(car)} style={{ marginRight: "10px" }}>Select</button>
          <button onClick={() => onDelete(car.id)} style={{ background: "#ff4444" }}>Remove</button>
        </div>
      </div>

      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: "100px",
          background: "#111",
          borderRadius: "15px",
          border: "3px solid #00ffff",
          boxShadow: "0 0 30px #00ffff",
          overflow: "hidden"
        }}
      >
        <div
          ref={carRef}
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            transition: "none",
          }}
        >
          <div
            style={{
              width: "160px",
              height: "60px",
              background: car.color,
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              fontWeight: "bold",
              boxShadow: "0 0 20px " + car.color,
            }}
          >
            {car.name}
          </div>
        </div>

        {/* ფინიშის ხაზი */}
        <div
          style={{
            position: "absolute",
            right: "20px",
            top: "0",
            bottom: "0",
            width: "15px",
            background: "repeating-linear-gradient(0deg, #fff, #fff 20px, #000 20px, #000 40px)",
            boxShadow: "0 0 20px #fff",
          }}
        />
      </div>
    </div>
  );
};

export default CarItem;