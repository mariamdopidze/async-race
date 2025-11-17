import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../features/garage/garageSlice";
import { RootState, AppDispatch } from "../store";

export const useCars = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cars = useSelector((state: RootState) => state.garage.cars);

  useEffect(() => {
   
    dispatch(fetchCars());
  }, [dispatch]);

  return cars;
};
