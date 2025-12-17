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

  const startDriving = async () => {
    if (isRacing.current) return;
    isRacing.current = true;

    try {
      const { velocity, distance } = await startEngine(car.id);
      const duration = Math.round(distance / velocity); // ms

      const driveRes = await switchToDrive(car.id);
      if (!driveRes.success) {
        console.log(`${car.name} გაიჭედა!`);
        isRacing.current = false;
        return;
      }

      if (!trackRef.current || !carRef.current) return;

      const trackWidth = trackRef.current.offsetWidth - carRef.current.offsetWidth - 50;

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
      console.log("ძრავის პრობლემა", err);
      isRacing.current = false;
    }
  };

  const stopDriving = async () => {
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
      console.log("გაჩერების შეცდომა", err);
    }
    isRacing.current = false;
  };

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (customEvent.detail === car.id) startDriving();
    };

    const handleStop = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (customEvent.detail === car.id) stopDriving();
    };

    window.addEventListener("start-car", handleStart);
    window.addEventListener("stop-car", handleStop);

    return () => {
      window.removeEventListener("start-car", handleStart);
      window.removeEventListener("stop-car", handleStop);
    };
  }, [car.id]);

  return (
    <div style={{ margin: "40px 0", padding: "20px", background: "rgba(0,0,0,0.6)", borderRadius: "15px", border: "2px solid #444" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ color: "#00ffff", fontSize: "1.8rem", textShadow: "0 0 15px #00ffff" }}>
          {car.name.toUpperCase()}
        </h3>
        <div>
          <button onClick={() => onSelect(car)} style={{ marginRight: "10px", padding: "8px 16px", background: "#333", color: "#00ffff" }}>
            Select
          </button>
          <button onClick={() => onDelete(car.id)} style={{ padding: "8px 16px", background: "#ff4444", color: "white" }}>
            Remove
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: "120px",
          background: "linear-gradient(to bottom, #111 0%, #222 50%, #111 100%)",
          borderRadius: "15px",
          border: "4px solid #00ffff",
          boxShadow: "0 0 40px #00ffff",
          overflow: "hidden"
        }}
      >
        <div
          ref={carRef}
          style={{
            position: "absolute",
            left: "20px",
            top: "30px",
            transition: "none",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "60px",
              background: car.color,
              borderRadius: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
              fontWeight: "bold",
              fontSize: "1.2rem",
              boxShadow: "0 0 30px " + car.color,
            }}
          >
            {car.name}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "20px",
            top: "0",
            bottom: "0",
            width: "20px",
            background: "repeating-linear-gradient(0deg, #fff, #fff 30px, #000 30px, #000 60px)",
            boxShadow: "0 0 40px #fff",
          }}
        />
      </div>
    </div>
  );
};

export default CarItem;