import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const WinnersPage = () => {
  const winners = useSelector((state: RootState) => state.winners.winners);

  return (
    <div className="page">
      <h1>Winners</h1>

      {winners.length === 0 ? (
        <p>No winners yet</p>
      ) : (
        <ul>
          {winners.map((w) => (
            <li key={w.id}>
              {w.name} - Wins: {w.wins} - Best Time: {w.bestTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WinnersPage;
