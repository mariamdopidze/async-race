
import React, { useEffect, useRef } from "react";
import { Car } from "../api/garageApi";
import { useCarAnimation } from "../hooks/useCarAnimation";
import { startEngine, stopEngine, switchToDrive } from "../api/engineApi";

interface Props {
  car: Car;
  onDelete: (id: number) => void;
  onSelect: (car: Car) => void;
}

const CarItem: React.FC<Props> = ({ car, onDelete, onSelect }) => {
  const { animate, stop } = useCarAnimation();
  const carRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const startDriving = async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    try {
      const { velocity, distance } = await startEngine(car.id);
      const duration = distance / velocity; 

      await switchToDrive(car.id); 

      animate(
        duration,
        (progress) => {
          if (carRef.current) {
            carRef.current.style.transform = `translateX(${progress * 1000}px)`; 
          }
        },
        () => {
          isAnimating.current = false;
          window.dispatchEvent(
            new CustomEvent("car-finished", {
              detail: { car, time: duration },
            })
          );
        }
      );
    } catch (err: any) {
      isAnimating.current = false;
      stop();
    }
  };

  const stopDriving = async () => {
    stop();
    if (carRef.current) {
      carRef.current.style.transform = "translateX(0px)";
    }
    await stopEngine(car.id);
    isAnimating.current = false;
  };

  useEffect(() => {
    const handleStart = (e: CustomEvent<number>) => {
      if (e.detail === car.id) startDriving();
    };
    const handleStop = (e: CustomEvent<number>) => {
      if (e.detail === car.id) stopDriving();
    };

    window.addEventListener("start-car", handleStart as EventListener);
    window.addEventListener("stop-car", handleStop as EventListener);

    return () => {
      window.removeEventListener("start-car", handleStart as EventListener);
      window.removeEventListener("stop-car", handleStop as EventListener);
    };
  }, [car.id]);


return (
  <div style={{ margin: "40px 0", padding: 20, background: "rgba(0,0,0,0.6)", borderRadius: 15, border: "2px solid #333" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
      <h3 style={{ color: "#00f0ff", fontSize: "1.8rem", textShadow: "0 0 10px #00f0ff" }}>
        {car.name.toUpperCase()}
      </h3>
      <div>
        <button style={{ background: "#00f0ff", color: "#000" }}>SELECT</button>
        <button style={{ background: "#ff0066", color: "#fff", marginLeft: 10 }}>REMOVE</button>
      </div>
    </div>

    <div className="track" style={{ height: 100, borderRadius: 15, position: "relative" }}>
      <div
        ref={carRef}
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          transition: "none",
          transform: "translateX(0px)",
        }}
      >
        <svg width="160" height="70" viewBox="0 0 160 70">
          <defs>
            <linearGradient id={`grad-${car.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={car.color} />
              <stop offset="100%" stopColor="#fff" />
            </linearGradient>
          </defs>
          <rect width="160" height="60" fill={`url(#grad-${car.id})`} rx="20" />
          <text x="80" y="40" fill="#000" fontSize="18" fontWeight="bold" textAnchor="middle">
            {car.name.split(" ")[0]}
          </text>
        </svg>
      </div>
      <div className="finish-line" />
    </div>
  </div>
);
};

export default CarItem;