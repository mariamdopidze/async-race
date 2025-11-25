
import React, { useState, useEffect } from "react";
import { getWinners } from "../api/winnersApi";

interface WinnerRow {
  id: number;
  carId: number;
  name: string;
  color: string;
  wins: number;
  time: number;
}

const WinnersPage: React.FC = () => {
  const [winners, setWinners] = useState<WinnerRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<'wins' | 'time'>('wins');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const limit = 10;

  const loadWinners = async () => {
    const { data, total } = await getWinners(page, limit, sort, order);
    const formatted = data.map((w: any) => ({
      id: w.id,
      carId: w.car.id,
      name: w.car.name,
      color: w.car.color,
      wins: w.wins,
      time: w.time,
    }));
    setWinners(formatted);
    setTotal(total);
  };

  useEffect(() => {
    loadWinners();
  }, [page, sort, order]);

  const toggleSort = (field: 'wins' | 'time') => {
    if (sort === field) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSort(field);
      setOrder('DESC');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>WINNERS ({total})</h1>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr style={{ background: "#222", color: "white" }}>
            <th style={{ padding: 15 }}>№</th>
            <th style={{ padding: 15 }}>Car</th>
            <th style={{ padding: 15 }}>Name</th>
            <th style={{ padding: 15, cursor: "pointer" }} onClick={() => toggleSort('wins')}>
              Wins {sort === 'wins' && (order === 'DESC' ? '↓' : '↑')}
            </th>
            <th style={{ padding: 15, cursor: "pointer" }} onClick={() => toggleSort('time')}>
              Best Time (s) {sort === 'time' && (order === 'DESC' ? '↓' : '↑')}
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((w, index) => (
            <tr key={w.id} style={{ background: index % 2 === 0 ? "#f0f0f0" : "white" }}>
              <td style={{ textAlign: "center", padding: 15 }}>{(page - 1) * limit + index + 1}</td>
              <td style={{ textAlign: "center" }}>
                <svg width="80" height="40">
                  <rect width="80" height="35" fill={w.color} rx="8" />
                  <text x="40" y="22" fill="white" fontSize="12" textAnchor="middle">{w.name}</text>
                </svg>
              </td>
              <td style={{ textAlign: "center", fontWeight: "bold" }}>{w.name}</td>
              <td style={{ textAlign: "center", fontSize: "1.2rem", color: "gold" }}>{w.wins}</td>
              <td style={{ textAlign: "center", color: "#d40000" }}>{w.time.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>← Prev</button>
        <span style={{ margin: "0 20px", fontSize: "1.2rem" }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}>Next →</button>
      </div>
    </div>
  );
};

export default WinnersPage;