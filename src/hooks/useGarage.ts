
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { fetchCars, addCar, editCar, removeCar } from "../features/garage/garageSlice";
import { Car } from "../api/garageApi";

export const useGarage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cars, loading, error } = useSelector((state: RootState) => state.garage);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const addNewCar = (name: string, color: string) => {
    dispatch(addCar({ name, color }));
  };

  const updateCar = (id: number, name: string, color: string) => {
    dispatch(editCar({ id, name, color }));
  };

  const deleteCar = (id: number) => {
    dispatch(removeCar(id));
  };

  return { cars, loading, error, addNewCar, updateCar, deleteCar };
};
