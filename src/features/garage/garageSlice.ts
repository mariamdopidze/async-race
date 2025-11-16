
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Car } from '../../api/cars';

interface GarageState {
  cars: Car[];
  totalCars: number;
  currentPage: number;
}

const initialState: GarageState = {
  cars: [],
  totalCars: 0,
  currentPage: 1,
};

const garageSlice = createSlice({
  name: 'garage',
  initialState,
  reducers: {
    setCars(state, action: PayloadAction<Car[]>) {
      state.cars = action.payload;
    },
    setTotalCars(state, action: PayloadAction<number>) {
      state.totalCars = action.payload;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    addCar(state, action: PayloadAction<Car>) {
      state.cars.push(action.payload);
    },
    updateCar(state, action: PayloadAction<Car>) {
      const index = state.cars.findIndex(c => c.id === action.payload.id);
      if (index !== -1) state.cars[index] = action.payload;
    },
    removeCar(state, action: PayloadAction<number>) {
      state.cars = state.cars.filter(c => c.id !== action.payload);
    },
  },
});

export const { setCars, setTotalCars, setCurrentPage, addCar, updateCar, removeCar } = garageSlice.actions;
export default garageSlice.reducer;
