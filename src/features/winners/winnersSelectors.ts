
import { RootState } from '../../store';
import { Winner } from './winnersSlice';

export const selectWinners = (state: RootState): Winner[] => state.winners.winners;

