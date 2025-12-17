// src/pages/WinnersPage.tsx
import React, { useState, useEffect } from "react";
import { getWinners } from "../api/winnersApi";

const WinnersPage = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"wins" | "time">("wins");
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    const load = async () => {
      const { data, total } = await getWinners(page, 10, sort, order);
      setWinners(data);
      setTotal(total);
    };
    load();
  }, [page, sort, order]);

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ textAlign: "center", color: "#ff00ff" }}>WINNERS ({total})</h1>

      <button onClick={() => {
        if (sort === "wins") setSort("time");
        else if (sort === "time") setOrder(order === "ASC" ? "DESC" : "ASC");
        else setSort("wins");
      }}>
        Sort by {sort} {order}
      </button>

      <table style={{ width: "100%", marginTop: "40px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>№</th>
            <th>Car</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best Time</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((w, i) => (
            <tr key={w.id}>
              <td>{(page - 1) * 10 + i + 1}</td>
              <td><div style={{ width: "100px", height: "50px", background: w.car.color, margin: "0 auto", borderRadius: "10px" }}></div></td>
              <td>{w.car.name}</td>
              <td>{w.wins}</td>
              <td>{w.time.toFixed(2)}s</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>Prev</button>
        <span style={{ margin: "0 30px" }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * 10 >= total}>Next</button>
      </div>
    </div>
  );
};

export default WinnersPage;