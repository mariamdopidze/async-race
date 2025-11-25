import React, { useState, useEffect } from "react";

const WinnersPage = () => {
  const [winners, setWinners] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("wins");

  useEffect(() => {
    fetch(`http://127.0.0.1:3000/winners?_page=${page}&_limit=10&_sort=${sort}&_order=DESC&_embed=car`)
      .then(r => {
        const total = r.headers.get("X-Total-Count");
        return r.json().then(data => ({ data, total: total ? +total : 0 }));
      })
      .then(({ data, total }) => {
        setWinners(data);
      });
  }, [page, sort]);

  return (
    <div style={{ padding: 40 }}>
      <h1>WINNERS</h1>
      <button onClick={() => setSort(sort === "wins" ? "time" : "wins")}>
        Sort by {sort === "wins" ? "Time" : "Wins"}
      </button>

      <table style={{ width: "100%", marginTop: 30, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#161b22" }}>
            <th style={{ padding: 15 }}>№</th>
            <th>Car</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best Time</th>
          </tr>
        </thead>
        <tbody>
          {winners.map((w: any, i: number) => (
            <tr key={w.id} style={{ background: i%2===0 ? "#161b22" : "#0d1117" }}>
              <td style={{ textAlign: "center", padding: 15 }}>{(page-1)*10 + i + 1}</td>
              <td style={{ textAlign: "center" }}>
                <div style={{ width: 100, height: 50, background: w.car.color, borderRadius: 10, margin: "0 auto" }}></div>
              </td>
              <td style={{ textAlign: "center" }}>{w.car.name}</td>
              <td style={{ textAlign: "center", fontSize: "1.5rem", color: "#00ff88" }}>{w.wins}</td>
              <td style={{ textAlign: "center" }}>{w.time}s</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WinnersPage;