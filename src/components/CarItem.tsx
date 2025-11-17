
import React from "react";
import { Car } from "../types";

interface CarItemProps {
  car: Car;
}

const CarItem: React.FC<CarItemProps> = ({ car }) => {
  return <li>{car.name} - {car.color}</li>;
};

export default CarItem;
