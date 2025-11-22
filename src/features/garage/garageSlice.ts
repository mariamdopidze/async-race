
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getCars, createCar as apiCreateCar, updateCar as apiUpdateCar, deleteCar as apiDeleteCar, Car } from "../../api/garageApi";

export interface GarageState {
  cars: Car[];
  loading: boolean;
  error: string | null;
}

const initialState: GarageState = {
  cars: [],
  loading: false,
  error: null,
};


export const fetchCars = createAsyncThunk("garage/fetchCars", async () => {
  const result = await getCars();
  return result.data;
});

export const addCar = createAsyncThunk(
  "garage/addCar",
  async (car: { name: string; color: string }) => {
    const result = await apiCreateCar(car.name, car.color);
    return result;
  }
);

export const editCar = createAsyncThunk(
  "garage/editCar",
  async (car: { id: number; name: string; color: string }) => {
    const result = await apiUpdateCar(car.id, car.name, car.color);
    return result;
  }
);

export const removeCar = createAsyncThunk(
  "garage/removeCar",
  async (id: number) => {
    await apiDeleteCar(id);
    return id;
  }
);


const garageSlice = createSlice({
  name: "garage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action: PayloadAction<Car[]>) => {
        state.cars = action.payload;
        state.loading = false;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching cars";
      })


      .addCase(addCar.fulfilled, (state, action: PayloadAction<Car>) => {
        state.cars.push(action.payload);
      })


      .addCase(editCar.fulfilled, (state, action: PayloadAction<Car>) => {
        const index = state.cars.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })

      .addCase(removeCar.fulfilled, (state, action: PayloadAction<number>) => {
        state.cars = state.cars.filter(c => c.id !== action.payload);
      });
  },
});

export default garageSlice.reducer;
