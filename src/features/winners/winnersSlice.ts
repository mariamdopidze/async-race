import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Winner = {
  id: number;
  name: string;
  color: string;
  wins: number;
  bestTime: number;
};

interface WinnersState {
  winners: Winner[];
}

const initialState: WinnersState = {
  winners: [],
};

export const winnersSlice = createSlice({
  name: 'winners',
  initialState,
  reducers: {
    addWinner: (state, action: PayloadAction<Winner>) => {
      const existing = state.winners.find(w => w.id === action.payload.id);
      if (existing) {
        existing.wins += action.payload.wins;
        if (action.payload.bestTime < existing.bestTime) {
          existing.bestTime = action.payload.bestTime;
        }
      } else {
        state.winners.push(action.payload);
      }
    },
    setWinners: (state, action: PayloadAction<Winner[]>) => {
      state.winners = action.payload;
    },
  },
});

export const { addWinner, setWinners } = winnersSlice.actions;
export default winnersSlice.reducer;
