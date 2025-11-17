import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addWinner } from "../features/winners/winnersSlice";

export const useWinners = () => {
  const dispatch = useDispatch();
  const winners = useSelector((state: RootState) => state.winners.winners);

  return {
    winners,
    addWinner: (winner: any) => dispatch(addWinner(winner)),
  };
};
